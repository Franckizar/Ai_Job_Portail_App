from flask import Flask, request, jsonify
import mysql.connector
import requests
import re
import json

app = Flask(__name__)

# This will be populated dynamically from the actual database
ACTUAL_SCHEMA = {}

def load_actual_schema():
    """Load the REAL schema from the database - no assumptions!"""
    global ACTUAL_SCHEMA
    
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="security"
        )
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SHOW TABLES")
        tables = [row[0] for row in cursor.fetchall()]
        
        # Get actual columns for each table
        for table in tables:
            cursor.execute(f"DESCRIBE {table}")
            columns = [row[0] for row in cursor.fetchall()]
            
            # Get primary key
            cursor.execute(f"SHOW KEYS FROM {table} WHERE Key_name = 'PRIMARY'")
            primary_key_result = cursor.fetchone()
            primary_key = primary_key_result[4] if primary_key_result else None
            
            ACTUAL_SCHEMA[table] = {
                "columns": columns,
                "primary_key": primary_key
            }
        
        conn.close()
        print(f"✅ Loaded ACTUAL schema for {len(ACTUAL_SCHEMA)} tables:")
        for table, info in ACTUAL_SCHEMA.items():
            print(f"  📋 {table}: {info['columns']}")
            
    except Exception as e:
        print(f"❌ Failed to load actual schema: {e}")
        ACTUAL_SCHEMA = {}

# Load the actual schema when the module starts
load_actual_schema()

def create_strict_schema_prompt(user_question):
    """Create a STRICT prompt that forces the AI to use only existing columns from ACTUAL database"""
    
    if not ACTUAL_SCHEMA:
        return "ERROR: No schema loaded. Please check database connection."
    
    # Build exact schema description from ACTUAL database
    schema_description = "🔴 CRITICAL: USE ONLY THESE EXACT COLUMNS FROM ACTUAL DATABASE - NO EXCEPTIONS!\n\n"
    
    for table_name, table_info in ACTUAL_SCHEMA.items():
        schema_description += f"Table: {table_name}\n"
        schema_description += f"Available Columns: {', '.join(table_info['columns'])}\n"
        if table_info.get('primary_key'):
            schema_description += f"Primary Key: {table_info['primary_key']}\n"
        schema_description += "\n"
    
    # Show a clear example of what columns are available
    schema_description += "🔍 EXAMPLE QUERIES USING ACTUAL COLUMNS:\n"
    for table_name, table_info in ACTUAL_SCHEMA.items():
        cols = table_info['columns'][:3]  # Show first 3 columns as example
        schema_description += f"SELECT {', '.join(cols)} FROM {table_name};\n"
    
    prompt = f"""You are a MySQL query generator. You MUST use ONLY the exact columns from the ACTUAL database schema below.

{schema_description}

🚨 ABSOLUTE RULES - NO EXCEPTIONS:
1. NEVER use columns that are NOT in the "Available Columns" list above
2. NEVER assume column names - ONLY use what's explicitly shown
3. If you need a column that doesn't exist, use the closest available column
4. ONLY use table names and column names from the ACTUAL schema above
5. Before writing any query, CHECK that every column exists in the schema
6. DO NOT use common column names like 'name', 'title', 'description' unless they appear in the Available Columns list

VERIFICATION PROCESS:
1. Look at the user question
2. Identify which table(s) you need
3. Check the "Available Columns" for each table
4. Write SQL using ONLY those exact columns
5. Double-check every column name against the schema

User Question: "{user_question}"

Generate a SQL query using ONLY the columns listed in the ACTUAL schema above. Verify each column exists before using it!

SQL Query:"""
    
    return prompt

def smart_sql_correction(query):
    """Intelligent SQL correction that handles context"""
    
    # Step 1: Handle table aliases and context-aware corrections
    corrected_query = query
    
    # Step 2: Fix column name issues based on context
    corrections = [
        # Fix users table references
        {
            "pattern": r'\busers\.user_id\b',
            "replacement": "users.id",
            "description": "users.user_id -> users.id"
        },
        {
            "pattern": r'\bu\.user_id\b(?=\s*,|\s*FROM|\s*ORDER|\s*GROUP)',
            "replacement": "u.id",
            "description": "u.user_id -> u.id (when selecting from users)"
        },
        {
            "pattern": r'\busername\b',
            "replacement": "email",
            "description": "username -> email"
        },
        {
            "pattern": r'\bfirst_name\b',
            "replacement": "firstname",
            "description": "first_name -> firstname"
        },
        {
            "pattern": r'\blast_name\b',
            "replacement": "lastname",
            "description": "last_name -> lastname"
        },
        {
            "pattern": r'\brole_name\b',
            "replacement": "role",
            "description": "role_name -> role"
        }
    ]
    
    applied_corrections = []
    for correction in corrections:
        if re.search(correction["pattern"], corrected_query, re.IGNORECASE):
            corrected_query = re.sub(correction["pattern"], correction["replacement"], corrected_query, flags=re.IGNORECASE)
            applied_corrections.append(correction["description"])
    
    return corrected_query, applied_corrections

def validate_and_auto_fix(query):
    """Comprehensive validation using ACTUAL schema"""
    
    if not ACTUAL_SCHEMA:
        return ["No actual schema loaded"], ["Please check database connection"]
    
    # Extract table names from query
    table_pattern = r'\b(?:FROM|JOIN)\s+(\w+)'
    tables_in_query = re.findall(table_pattern, query, re.IGNORECASE)
    
    issues = []
    suggestions = []
    
    # Check if all tables exist in our ACTUAL schema
    for table in tables_in_query:
        if table not in ACTUAL_SCHEMA:
            issues.append(f"Table '{table}' not found in actual database schema")
            # Suggest similar table names
            for schema_table in ACTUAL_SCHEMA.keys():
                if table.lower() in schema_table.lower() or schema_table.lower() in table.lower():
                    suggestions.append(f"Did you mean '{schema_table}'? Available columns: {ACTUAL_SCHEMA[schema_table]['columns']}")
    
    # Extract column references and validate against ACTUAL schema
    column_pattern = r'\b(\w+)\.(\w+)\b'
    column_refs = re.findall(column_pattern, query, re.IGNORECASE)
    
    for table_alias, column in column_refs:
        # Skip if it's a function or not a table reference
        if table_alias.upper() in ['SELECT', 'FROM', 'WHERE', 'ORDER', 'GROUP']:
            continue
            
        # Find the actual table name (could be alias)
        actual_table = None
        for table_name in ACTUAL_SCHEMA.keys():
            if table_alias.lower() == table_name.lower():
                actual_table = table_name
                break
        
        if actual_table and column not in ACTUAL_SCHEMA[actual_table]["columns"]:
            issues.append(f"Column '{column}' not found in table '{actual_table}'")
            # Suggest similar columns from ACTUAL schema
            for valid_column in ACTUAL_SCHEMA[actual_table]["columns"]:
                if column.lower() in valid_column.lower() or valid_column.lower() in column.lower():
                    suggestions.append(f"Did you mean '{actual_table}.{valid_column}'?")
            
            # If no similar column found, show all available columns
            if not any(column.lower() in col.lower() for col in ACTUAL_SCHEMA[actual_table]["columns"]):
                suggestions.append(f"Available columns in '{actual_table}': {', '.join(ACTUAL_SCHEMA[actual_table]['columns'])}")
    
    return issues, suggestions

def get_table_schema(table_name):
    """Get actual column names from database"""
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="security"
        )
        cursor = conn.cursor()
        cursor.execute(f"DESCRIBE {table_name}")
        columns = [row[0] for row in cursor.fetchall()]
        conn.close()
        return columns
    except:
        return []

def execute_sql_with_retry(query, max_retries=3):
    """Execute SQL with automatic retry and intelligent error handling"""
    
    for attempt in range(max_retries + 1):
        try:
            conn = mysql.connector.connect(
                host="localhost",
                user="root",
                password="",
                database="security"
            )
            cursor = conn.cursor()
            cursor.execute(query)
            
            # Get column names
            columns = [desc[0] for desc in cursor.description] if cursor.description else []
            
            # Fetch results
            if cursor.description:
                rows = cursor.fetchall()
            else:
                rows = []
                
            conn.close()
            return columns, rows, None
            
        except mysql.connector.Error as err:
            if 'conn' in locals():
                conn.close()
            
            error_msg = str(err)
            
            # If it's the last attempt, return the error
            if attempt == max_retries:
                return None, None, error_msg
            
            # Try to auto-fix common errors
            if "Unknown column" in error_msg:
                # Extract the problematic column and table
                match = re.search(r"Unknown column '([^']+)'", error_msg)
                if match:
                    bad_column = match.group(1)
                    
                    # Get table name from the bad column (e.g., 's.name' -> 's')
                    if '.' in bad_column:
                        table_alias, column_name = bad_column.split('.', 1)
                        
                        # Find the actual table name for this alias
                        alias_match = re.search(rf'\b(\w+)\s+{table_alias}\b', query, re.IGNORECASE)
                        if alias_match:
                            actual_table = alias_match.group(1)
                            
                            # Get actual columns for this table
                            actual_columns = get_table_schema(actual_table)
                            
                            # Try to find a similar column
                            for col in actual_columns:
                                if column_name.lower() in col.lower() or col.lower() in column_name.lower():
                                    # Replace the bad column with the correct one
                                    query = query.replace(f"{table_alias}.{column_name}", f"{table_alias}.{col}")
                                    print(f"🔧 Auto-fixed: {table_alias}.{column_name} -> {table_alias}.{col}")
                                    break
                            else:
                                # If no similar column found, try common patterns
                                if column_name.lower() == 'name':
                                    # Common alternatives for 'name' column
                                    for alt in ['title', 'service_name', 'description', 'label']:
                                        if alt in actual_columns:
                                            query = query.replace(f"{table_alias}.{column_name}", f"{table_alias}.{alt}")
                                            print(f"🔧 Auto-fixed: {table_alias}.{column_name} -> {table_alias}.{alt}")
                                            break
                    else:
                        # Simple column name fix
                        if bad_column == "user_id" and "users" in query:
                            query = query.replace("users.user_id", "users.id")
                        elif bad_column == "username":
                            query = query.replace("username", "email")
                        elif bad_column == "first_name":
                            query = query.replace("first_name", "firstname")
                        elif bad_column == "last_name":
                            query = query.replace("last_name", "lastname")
                        elif bad_column == "role_name":
                            query = query.replace("role_name", "role")
                    
                    continue
            
            # If we can't auto-fix, return the error
            return None, None, error_msg

@app.route('/ai', methods=['POST'])
def ai_response():
    user_question = request.json.get("question", "")
    print(f"❓ User question: {user_question}")

    # Step 1: Generate SQL with STRICT schema enforcement
    try:
        strict_prompt = create_strict_schema_prompt(user_question)
        response_sql = requests.post("http://localhost:11434/api/generate", json={
            "model": "dolphin3:latest",
            "prompt": strict_prompt,
            "stream": False
        })
        
        if response_sql.status_code != 200:
            return jsonify({"error": "Failed to connect to AI model"}), 500
            
        generated_sql = response_sql.json().get("response", "").strip()
        
        # Clean up the response - Fixed the regex patterns
        generated_sql = re.sub(r'^```sql\s*', '', generated_sql, flags=re.MULTILINE)
        generated_sql = re.sub(r'```\s*$', '', generated_sql, flags=re.MULTILINE)
        generated_sql = generated_sql.strip()
        
        print(f"🧠 Generated SQL: {generated_sql}")

    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500

    # Step 2: Apply intelligent corrections
    corrected_sql, applied_corrections = smart_sql_correction(generated_sql)
    print(f"🔧 Corrected SQL: {corrected_sql}")
    print(f"📝 Applied corrections: {applied_corrections}")

    # Step 3: Validate and get suggestions
    issues, suggestions = validate_and_auto_fix(corrected_sql)
    
    # Step 4: Execute with retry mechanism
    columns, rows, error = execute_sql_with_retry(corrected_sql)

    if error:
        return jsonify({
            "error": f"Database error: {error}",
            "generated_sql": generated_sql,
            "corrected_sql": corrected_sql,
            "applied_corrections": applied_corrections,
            "validation_issues": issues,
            "suggestions": suggestions,
            "debug_info": {
                "available_tables": list(ACTUAL_SCHEMA.keys()),
                "actual_schema": ACTUAL_SCHEMA,
                "common_fixes": [
                    "Check actual columns in each table",
                    "Use /discover-schema to see real database structure",
                    "Never assume column names - use only what exists"
                ]
            }
        }), 400

    # Step 5: Generate natural language response
    if rows:
        data_summary = f"Found {len(rows)} records:\n\n"
        for i, row in enumerate(rows[:10], 1):
            row_dict = dict(zip(columns, row))
            data_summary += f"Record {i}: {json.dumps(row_dict, default=str)}\n"
        
        if len(rows) > 10:
            data_summary += f"\n... and {len(rows) - 10} more records."
    else:
        data_summary = "No records found matching your criteria."

    prompt_answer = f"""
The user asked: "{user_question}"

Query Results:
{data_summary}

Provide a natural, helpful response about what you found. Be specific about the actual data, names, and numbers you can see. Make it conversational and informative.
"""

    try:
        response_summary = requests.post("http://localhost:11434/api/generate", json={
            "model": "dolphin3:latest",
            "prompt": prompt_answer,
            "stream": False
        })
        final_answer = response_summary.json().get("response", "Query completed successfully.")
    except:
        final_answer = f"Query executed successfully. Found {len(rows)} records."

    return jsonify({
        "answer": final_answer,
        "sql": corrected_sql,
        "original_sql": generated_sql,
        "applied_corrections": applied_corrections,
        "row_count": len(rows),
        "columns": columns,
        "data_preview": [dict(zip(columns, row)) for row in rows[:5]] if rows else [],
        "success": True
    })

@app.route('/discover-schema', methods=['GET'])
def discover_schema():
    """Discover actual schema from database"""
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="security"
        )
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SHOW TABLES")
        tables = [row[0] for row in cursor.fetchall()]
        
        # Get columns for each table
        discovered_schema = {}
        for table in tables:
            cursor.execute(f"DESCRIBE {table}")
            columns = []
            for row in cursor.fetchall():
                columns.append({
                    "name": row[0],
                    "type": row[1],
                    "null": row[2],
                    "key": row[3],
                    "default": row[4],
                    "extra": row[5]
                })
            discovered_schema[table] = columns
        
        conn.close()
        return jsonify({
            "discovered_schema": discovered_schema,
            "tables": tables
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/schema', methods=['GET'])
def get_schema():
    """Return the ACTUAL schema from database"""
    return jsonify({
        "actual_schema": ACTUAL_SCHEMA,
        "schema_source": "Loaded directly from database",
        "common_mistakes": {
            "wrong": ["Assuming column names", "Using hardcoded schema", "Not checking actual database structure"],
            "correct": ["Use only columns from actual_schema", "Check /discover-schema", "Verify column existence"]
        },
        "note": "This schema is loaded directly from your database - no assumptions!"
    })

@app.route('/refresh-schema', methods=['POST'])
def refresh_schema():
    """Manually refresh the schema from database"""
    load_actual_schema()
    return jsonify({
        "message": "Schema refreshed successfully",
        "loaded_tables": list(ACTUAL_SCHEMA.keys()),
        "table_details": {table: {"columns": info["columns"], "primary_key": info["primary_key"]} 
                         for table, info in ACTUAL_SCHEMA.items()}
    })
def test_endpoint():
    """Test endpoint with working queries"""
    return jsonify({
        "message": "Enhanced AI SQL Server is running!",
        "features": [
            "Automatic schema correction",
            "Intelligent error handling", 
            "Retry mechanism",
            "Comprehensive validation",
            "Natural language responses"
        ],
        "test_queries": [
            "Show me all users",
            "How many doctors do we have?",
            "List all appointments today",
            "Show me patient profiles",
            "Count users by role"
        ]
    })

if __name__ == '__main__':
    print("🚀 Enhanced AI SQL Server with REAL schema validation running at http://localhost:5000/ai")
    print("📊 Actual schema info: http://localhost:5000/schema")
    print("🔍 Discover schema: http://localhost:5000/discover-schema")
    print("🔄 Refresh schema: http://localhost:5000/refresh-schema")
    print("🧪 Test endpoint: http://localhost:5000/test")
    print("✅ Using ACTUAL database schema - no more wrong columns!")
    print(f"📋 Loaded {len(ACTUAL_SCHEMA)} tables from database")
    app.run(debug=True, port=5000)