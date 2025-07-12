from flask import Flask, request, jsonify
import mysql.connector
import requests
import re

app = Flask(__name__)

# === Define your DB schema in Python dictionaries for validation ===
table_columns = {
    "users": ["id", "email", "firstname", "lastname", "password", "token_version"],
    "user_roles": ["user_id", "role"],
    "patient_profiles": ["id", "user_id", "address", "phone_number", "date_of_birth"],
    "doctor_profiles": ["id", "user_id", "specialization", "years_of_experience"],
    "nurse_profiles": ["id", "user_id", "department", "shift"],
    "admin_profiles": ["id", "user_id", "is_super_admin"],
    "appointments": ["id", "patient_id", "doctor_id", "nurse_id", "start_time", "end_time", "status"],
    "medical_records": ["id", "patient_id", "doctor_id", "appointment_id", "diagnosis"],
    "prescriptions": ["id", "record_id", "medication", "dosage"],
    "services": ["id", "name", "price"],
    "invoices": ["id", "patient_id", "total_amount", "date"],
    "invoice_items": ["id", "invoice_id", "service_id", "quantity"],
    "event": ["id", "name", "description", "date"],
    "password_reset_token": ["id", "user_id", "token"]
}

known_tables = list(table_columns.keys())

# === Helper to guess table from alias in SQL query ===
def guess_table_from_alias(alias, query):
    # Extract table alias mappings from FROM and JOIN clauses
    alias_map = {}
    pattern = re.compile(r"(FROM|JOIN)\s+(\w+)(?:\s+AS)?\s+(\w+)", re.IGNORECASE)
    for m in pattern.finditer(query):
        _, tbl, als = m.groups()
        alias_map[als.lower()] = tbl.lower()
    # Also add table name mapping to itself for no-alias use
    for tbl in known_tables:
        alias_map[tbl] = tbl
    return alias_map.get(alias.lower(), alias.lower())

# === Validate that tables and columns exist in schema ===
def validate_query_against_schema(query):
    issues = []

    # Extract referenced tables from FROM and JOIN clauses
    tables_in_query = set()
    for m in re.finditer(r"\bFROM\s+(\w+)|\bJOIN\s+(\w+)", query, re.IGNORECASE):
        tbl1, tbl2 = m.groups()
        if tbl1:
            tables_in_query.add(tbl1.lower())
        if tbl2:
            tables_in_query.add(tbl2.lower())

    # Check tables existence
    for tbl in tables_in_query:
        if tbl not in known_tables:
            issues.append(f"Table '{tbl}' does not exist in schema")

    # Extract all table.column usages
    pattern = re.compile(r"([a-zA-Z_][\w]*)\.([a-zA-Z_][\w]*)")
    for m in pattern.finditer(query):
        alias_or_table, column = m.groups()
        tbl = guess_table_from_alias(alias_or_table, query)
        if tbl in known_tables:
            if column not in table_columns[tbl]:
                issues.append(f"Column '{column}' not found in table '{tbl}'")
        else:
            # If table unknown, skip column validation here (already reported above)
            pass

    return issues

# === Prepare AI prompt with your exact schema info ===
def create_enhanced_prompt(user_question):
    schema_desc = "\n".join(
        f"- {table}: {', '.join(cols)}" for table, cols in table_columns.items()
    )
    prompt = f"""
You are an expert MySQL query generator. Generate COMPLETE, VALID SQL queries.

DATABASE SCHEMA:
{schema_desc}

IMPORTANT:
- Use exact column and table names as above.
- No other tables exist (e.g., no 'roles' table).
- The 'user_roles' table has columns 'user_id' and 'role' (a string).
- Primary key of users is 'id'.
- When joining tables, respect foreign keys and schema.

User Question: "{user_question}"

Generate a complete SQL query using the schema above:
"""
    return prompt.strip()

# === Clean AI response to extract SQL ===
def clean_sql_response(response):
    lines = response.split("\n")
    sql_lines = []
    for line in lines:
        line = line.strip()
        if line.upper().startswith(("SELECT", "INSERT", "UPDATE", "DELETE", "WITH")):
            sql_lines.append(line)
        elif sql_lines and line and not line.startswith("--"):
            sql_lines.append(line)
    return " ".join(sql_lines) if sql_lines else response.strip()

# === Execute SQL query on your DB ===
def execute_sql(query):
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="job_portail"
        )
        cursor = conn.cursor()
        cursor.execute(query)
        columns = [desc[0] for desc in cursor.description] if cursor.description else []
        rows = cursor.fetchall() if cursor.description else []
        conn.close()
        return columns, rows, None
    except mysql.connector.Error as err:
        return None, None, str(err)

# === Main AI SQL generation endpoint ===
@app.route("/ai", methods=["POST"])
def ai_response():
    user_question = request.json.get("question", "").strip()
    if not user_question:
        return jsonify({"error": "Question is required"}), 400

    # 1) Create prompt for AI with full schema info
    prompt = create_enhanced_prompt(user_question)

    # 2) Call AI generation API
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "dolphin3:latest", "prompt": prompt, "stream": False},
            timeout=10
        )
        response.raise_for_status()
        generated_sql = response.json().get("response", "").strip()
        generated_sql = clean_sql_response(generated_sql)
    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500

    # 3) Validate generated SQL against schema
    issues = validate_query_against_schema(generated_sql)
    if issues:
        return jsonify({
            "error": "Schema validation failed",
            "issues": issues,
            "generated_sql": generated_sql,
            "hint": "Check the tables and columns against your schema"
        }), 400

    # 4) Execute SQL query
    columns, rows, error = execute_sql(generated_sql)
    if error:
        return jsonify({
            "error": f"Database error: {error}",
            "generated_sql": generated_sql
        }), 400

    # 5) Prepare result preview
    preview = f"Columns: {columns}\nTotal rows: {len(rows)}\n"
    for i, row in enumerate(rows[:5]):
        preview += f"Row {i+1}: {dict(zip(columns, row))}\n"
    if len(rows) > 5:
        preview += f"... and {len(rows) - 5} more rows."

    # 6) Optional: Generate natural language summary from AI (can fail silently)
    summary_prompt = f"""
User asked: "{user_question}"

Here are some results from the query:
{preview}

Please provide a friendly, non-technical summary of what this data shows.
"""
    try:
        summary_resp = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "dolphin3:latest", "prompt": summary_prompt, "stream": False},
            timeout=10
        )
        summary_resp.raise_for_status()
        summary = summary_resp.json().get("response", "Query executed successfully.")
    except Exception:
        summary = "Query executed successfully."

    # 7) Return final JSON
    return jsonify({
        "answer": summary,
        "sql": generated_sql,
        "result_preview": preview,
        "row_count": len(rows),
        "columns": columns
    })

# === Test endpoint to verify server and schema ===
@app.route("/test", methods=["GET"])
def test_endpoint():
    sample_queries = [
        "SELECT id, email, firstname, lastname FROM users LIMIT 5",
        "SELECT u.id, u.email, u.firstname, u.lastname, ur.role FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LIMIT 5",
        "SELECT COUNT(*) as user_count FROM users",
        "SELECT ur.role, COUNT(*) as count FROM user_roles ur GROUP BY ur.role"
    ]
    return jsonify({
        "message": "AI SQL server is running!",
        "known_tables": known_tables,
        "sample_queries": sample_queries
    })

if __name__ == "__main__":
    print("🚀 AI SQL Flask server running at http://localhost:5000/ai")
    app.run(debug=True, port=5000)
