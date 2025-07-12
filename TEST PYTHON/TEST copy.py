from flask import Flask, request, jsonify
import mysql.connector
import requests

app = Flask(__name__)

# Load your DB schema once
with open("job_portail_schema.sql", "r", encoding="utf-8") as f:
    db_schema = f.read()

def execute_sql(query):
    print(f"\n📦 Running SQL Query:\n{query}")
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",  # add your password if needed
        database="security"  # replace with your database name
    )
    cursor = conn.cursor()
    try:
        cursor.execute(query)
        columns = cursor.column_names
        rows = cursor.fetchall()
        rows = cursor.fetchall()
        conn.close()
        print("✅ SQL executed successfully.")
        print(f"📄 Columns: {columns}")
        print(f"🔢 Rows: {rows[:5]}{'...' if len(rows) > 5 else ''}")
        return columns, rows, None
    except mysql.connector.Error as err:
        conn.close()
        print(f"❌ SQL execution error: {err}")
        return None, None, str(err)

@app.route('/ai', methods=['POST'])
def ai_response():
    user_question = request.json.get("question", "")
    print(f"\n🧠 User Question: {user_question}")

    prompt_sql = f"""
You are an expert SQL assistant.

Here is the database schema:
{db_schema}

Generate a single SQL query that answers this question:
\"\"\"{user_question}\"\"\"

Only provide the SQL query without explanations.
"""
    print("📤 Sending prompt to Ollama to generate SQL...")
    response_sql = requests.post("http://localhost:11434/api/generate", json={
        "model": "dolphin3:latest",
        "prompt": prompt_sql,
        "stream": False
    })

    generated_sql = response_sql.json().get("response", "").strip()
    print(f"🤖 Generated SQL:\n{generated_sql}")

    columns, rows, error = execute_sql(generated_sql)
    if error:
        return jsonify({"error": f"SQL execution error: {error}"}), 400

    result_preview = f"Columns: {columns}\nRows:\n"
    for row in rows[:10]:
        result_preview += str(row) + "\n"
    if len(rows) > 10:
        result_preview += f"... and {len(rows)-10} more rows."

    print("📤 Sending prompt to Ollama to explain results...")
    prompt_answer = f"""
The user asked: "{user_question}"

The SQL query generated was:
{generated_sql}

The result of the query was:
{result_preview}

Please provide a helpful, concise answer based on this data.
"""
    response_answer = requests.post("http://localhost:11434/api/generate", json={
        "model": "dolphin3:latest",
        "prompt": prompt_answer,
        "stream": False
    })

    final_answer = response_answer.json().get("response", "Sorry, no answer generated.")
    print(f"🧾 Final AI Answer: {final_answer}")

    return jsonify({
        "answer": final_answer,
        "sql": generated_sql,
        "result_preview": result_preview
    })

if __name__ == '__main__':
    print("🚀 AI server is starting on http://localhost:5000/ai")
    app.run(debug=True, port=5000)
