from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
from mysql.connector import Error
import requests
import re
import json
import logging
from typing import Dict, List, Tuple, Optional
from contextlib import contextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Global schema cache
ACTUAL_SCHEMA = {}

# Database configuration
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "security"  # Changed to Job_Portail
}

# AI model configuration
AI_CONFIG = {
    "url": "http://localhost:11434/api/generate",
    # "model": "dolphin3:latest"
    "model": "Models"
    # "model": "dentalclinic"
}

@contextmanager
def get_db_connection():
    """Context manager for database connections with proper cleanup"""
    conn = None
    try:
        conn = mysql.connector.connect(
            **DB_CONFIG,
            buffered=True,  # Add buffered=True to avoid unread results
            autocommit=True  # Enable autocommit for better transaction handling
        )
        if conn.is_connected():
            yield conn
        else:
            raise Error("Failed to establish database connection")
    except Error as e:
        logger.error(f"Database connection error: {e}")
        raise
    finally:
        if conn and conn.is_connected():
            conn.close()

def load_actual_schema():
    """Load the REAL schema from the database with proper cursor management"""
    global ACTUAL_SCHEMA
    
    try:
        with get_db_connection() as conn:
            # Get all tables first
            cursor = conn.cursor(buffered=True)
            cursor.execute("SHOW TABLES")
            tables = [row[0] for row in cursor.fetchall()]
            cursor.close()  # Close cursor after use
            
            # Get actual columns for each table
            schema = {}
            for table in tables:
                try:
                    # Use a new cursor for each table query
                    cursor = conn.cursor(buffered=True)
                    cursor.execute(f"DESCRIBE {table}")
                    columns = [row[0] for row in cursor.fetchall()]
                    cursor.close()
                    
                    # Get primary key with another new cursor
                    cursor = conn.cursor(buffered=True)
                    cursor.execute(f"SHOW KEYS FROM {table} WHERE Key_name = 'PRIMARY'")
                    primary_key_result = cursor.fetchone()
                    primary_key = primary_key_result[4] if primary_key_result else None
                    cursor.close()
                    
                    schema[table] = {
                        "columns": columns,
                        "primary_key": primary_key
                    }
                    
                except Error as e:
                    logger.error(f"Error loading schema for table {table}: {e}")
                    continue
            
            ACTUAL_SCHEMA = schema
            logger.info(f"✅ Loaded ACTUAL schema for {len(ACTUAL_SCHEMA)} tables")
            for table, info in ACTUAL_SCHEMA.items():
                logger.info(f"  📋 {table}: {info['columns']}")
                
    except Exception as e:
        logger.error(f"❌ Failed to load actual schema: {e}")
        ACTUAL_SCHEMA = {}

def create_strict_schema_prompt(user_question: str) -> str:
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
    
    # Show clear examples
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

def smart_sql_correction(query: str) -> Tuple[str, List[str]]:
    """Intelligent SQL correction that handles context"""
    
    corrected_query = query
    
    # Define common column name corrections
    corrections = [
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
            corrected_query = re.sub(
                correction["pattern"], 
                correction["replacement"], 
                corrected_query, 
                flags=re.IGNORECASE
            )
            applied_corrections.append(correction["description"])
    
    return corrected_query, applied_corrections

def validate_and_auto_fix(query: str) -> Tuple[List[str], List[str]]:
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

def get_table_schema(table_name: str) -> List[str]:
    """Get actual column names from database with proper cursor management"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(buffered=True)
            cursor.execute(f"DESCRIBE {table_name}")
            columns = [row[0] for row in cursor.fetchall()]
            cursor.close()
            return columns
    except Exception as e:
        logger.error(f"Error getting schema for table {table_name}: {e}")
        return []

def execute_sql_with_retry(query: str, max_retries: int = 3) -> Tuple[Optional[List[str]], Optional[List], Optional[str]]:
    """Execute SQL with automatic retry and intelligent error handling"""
    
    for attempt in range(max_retries + 1):
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor(buffered=True)
                cursor.execute(query)
                
                # Get column names
                columns = [desc[0] for desc in cursor.description] if cursor.description else []
                
                # Fetch results
                if cursor.description:
                    rows = cursor.fetchall()
                else:
                    rows = []
                
                cursor.close()
                return columns, rows, None
                
        except Error as err:
            error_msg = str(err)
            
            # If it's the last attempt, return the error
            if attempt == max_retries:
                return None, None, error_msg
            
            # Try to auto-fix common errors
            if "Unknown column" in error_msg:
                fixed_query = auto_fix_column_error(query, error_msg)
                if fixed_query:  # If we made a fix, try again
                    query = fixed_query
                    continue
            
            # If we can't auto-fix, return the error
            return None, None, error_msg
    
    return None, None, "Max retries exceeded"

def auto_fix_column_error(query: str, error_msg: str) -> Optional[str]:
    """Auto-fix column errors based on error message"""
    
    # Extract the problematic column
    match = re.search(r"Unknown column '([^']+)'", error_msg)
    if not match:
        return None
    
    bad_column = match.group(1)
    
    # Handle table.column format
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
                    new_query = query.replace(f"{table_alias}.{column_name}", f"{table_alias}.{col}")
                    logger.info(f"🔧 Auto-fixed: {table_alias}.{column_name} -> {table_alias}.{col}")
                    return new_query
            
            # Try common alternatives for 'name' column
            if column_name.lower() == 'name':
                for alt in ['title', 'service_name', 'description', 'label']:
                    if alt in actual_columns:
                        new_query = query.replace(f"{table_alias}.{column_name}", f"{table_alias}.{alt}")
                        logger.info(f"🔧 Auto-fixed: {table_alias}.{column_name} -> {table_alias}.{alt}")
                        return new_query
    else:
        # Handle simple column name fixes
        fixes = {
            "user_id": "id",
            "username": "email",
            "first_name": "firstname",
            "last_name": "lastname",
            "role_name": "role"
        }
        
        if bad_column in fixes:
            new_query = query.replace(bad_column, fixes[bad_column])
            logger.info(f"🔧 Auto-fixed: {bad_column} -> {fixes[bad_column]}")
            return new_query
    
    return None

def call_ai_model(prompt: str) -> Optional[str]:
    """Call the AI model with error handling"""
    try:
        response = requests.post(AI_CONFIG["url"], json={
            "model": AI_CONFIG["model"],
            "prompt": prompt,
            "stream": False
        }, timeout=30)
        
        if response.status_code != 200:
            logger.error(f"AI model returned status {response.status_code}")
            return None
            
        return response.json().get("response", "").strip()
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to call AI model: {e}")
        return None

def clean_sql_response(sql: str) -> str:
    """
    Extract just the SQL query portion, stripping away any natural language or explanations.
    """
    if not sql:
        return ""

    # Remove code block markers like ```sql and ```
    sql = re.sub(r"```(?:sql)?", "", sql)
    sql = sql.replace("```", "")

    # Remove all non-breaking spaces (U+00A0)
    sql = sql.replace('\u00a0', ' ')

    # Extract the first actual SQL query (SELECT, INSERT, etc.)
    sql_match = re.search(r"\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|DESCRIBE)\b[\s\S]+?;", sql, flags=re.IGNORECASE)
    if sql_match:
        return sql_match.group(0).strip()

    # Fallback: grab the first line that looks like SQL
    for line in sql.splitlines():
        if re.match(r"^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|DESCRIBE)\b", line, re.IGNORECASE):
            return line.strip()

    return sql.strip()

# Load the actual schema when the module starts
load_actual_schema()

# API Routes
@app.route('/ai', methods=['POST'])
def ai_response():
    """Main AI endpoint for processing user questions"""
    try:
        data = request.get_json()
        if not data or 'question' not in data:
            return jsonify({"error": "Missing 'question' in request body"}), 400
        
        user_question = data.get("question", "")
        logger.info(f"❓ User question: {user_question}")

        # Step 1: Generate SQL with STRICT schema enforcement
        strict_prompt = create_strict_schema_prompt(user_question)
        generated_sql = call_ai_model(strict_prompt)
        
        if not generated_sql:
            return jsonify({"error": "Failed to generate SQL query"}), 500
        
        generated_sql = clean_sql_response(generated_sql)
        logger.info(f"🧠 Generated SQL: {generated_sql}")

        # Step 2: Apply intelligent corrections
        corrected_sql, applied_corrections = smart_sql_correction(generated_sql)
        logger.info(f"🔧 Corrected SQL: {corrected_sql}")
        logger.info(f"📝 Applied corrections: {applied_corrections}")

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
        data_summary = generate_data_summary(rows, columns)
        final_answer = generate_natural_response(user_question, data_summary)

        return jsonify({
            "answer": final_answer,
            "sql": corrected_sql,
            "original_sql": generated_sql,
            "applied_corrections": applied_corrections,
            "row_count": len(rows) if rows else 0,
            "columns": columns,
            "data_preview": [dict(zip(columns, row)) for row in rows[:5]] if rows and columns else [],
            "success": True
        })

    except Exception as e:
        logger.error(f"Error in ai_response: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

def generate_data_summary(rows, columns):
    """Generate a summary of the data results"""
    if not rows:
        return "No records found matching your criteria."
    
    data_summary = f"Found {len(rows)} records:\n\n"
    for i, row in enumerate(rows[:10], 1):
        if columns:
            row_dict = dict(zip(columns, row))
            data_summary += f"Record {i}: {json.dumps(row_dict, default=str)}\n"
        else:
            data_summary += f"Record {i}: {row}\n"
    
    if len(rows) > 10:
        data_summary += f"\n... and {len(rows) - 10} more records."
    
    return data_summary

def generate_natural_response(user_question: str, data_summary: str) -> str:
    """Generate a *human-style* natural response with empathy and clarity"""
    
    prompt_answer = f"""
You are a friendly and professional assistant at a modern dental clinic. Speak like a caring dental coordinator, not a machine or SQL tool.

💬 Task:
- The user asked: "{user_question}"
- Here are the details of available services (or other results): 
{data_summary}

🎯 What to do:
- Instead of technical explanations, write a warm and professional explanation of the services.
- Break down the services (name, duration, purpose).
- Ask follow-up questions (e.g., "Are you feeling any pain?", "Is whitening something you'd like?").
- Do NOT mention SQL, database, or queries at all.
- Respond with natural, human language like a receptionist or dental nurse talking to a patient.

Now write that response:
"""
    
    response = call_ai_model(prompt_answer)
    return response if response else "We’ve found helpful information—let me guide you through it!"


@app.route('/discover-schema', methods=['GET'])
def discover_schema():
    """Discover actual schema from database"""
    try:
        with get_db_connection() as conn:
            # Get all tables
            cursor = conn.cursor(buffered=True)
            cursor.execute("SHOW TABLES")
            tables = [row[0] for row in cursor.fetchall()]
            cursor.close()
            
            # Get columns for each table
            discovered_schema = {}
            for table in tables:
                cursor = conn.cursor(buffered=True)
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
                cursor.close()
                discovered_schema[table] = columns
            
            return jsonify({
                "discovered_schema": discovered_schema,
                "tables": tables
            })
            
    except Exception as e:
        logger.error(f"Error discovering schema: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/schema', methods=['GET'])
def get_schema():
    """Return the ACTUAL schema from database"""
    return jsonify({
        "actual_schema": ACTUAL_SCHEMA,
        "schema_source": "Loaded directly from database",
        "database_name": DB_CONFIG["database"],
        "common_mistakes": {
            "wrong": ["Assuming column names", "Using hardcoded schema", "Not checking actual database structure"],
            "correct": ["Use only columns from actual_schema", "Check /discover-schema", "Verify column existence"]
        },
        "note": "This schema is loaded directly from your database - no assumptions!"
    })

@app.route('/refresh-schema', methods=['POST'])
def refresh_schema():
    """Manually refresh the schema from database"""
    try:
        load_actual_schema()
        return jsonify({
            "message": "Schema refreshed successfully",
            "database_name": DB_CONFIG["database"],
            "loaded_tables": list(ACTUAL_SCHEMA.keys()),
            "table_details": {
                table: {
                    "columns": info["columns"], 
                    "primary_key": info["primary_key"]
                } 
                for table, info in ACTUAL_SCHEMA.items()
            }
        })
    except Exception as e:
        logger.error(f"Error refreshing schema: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test_endpoint():
    """Test endpoint with working queries"""
    return jsonify({
        "message": "Enhanced AI SQL Server is running!",
        "database": DB_CONFIG["database"],
        "features": [
            "Automatic schema correction",
            "Intelligent error handling", 
            "Retry mechanism",
            "Comprehensive validation",
            "Natural language responses"
        ],
        "test_queries": [
            "Show me all users",
            "How many records are in the database?",
            "List all tables",
            "Show me the structure of users table",
            "Count records by table"
        ]
    })

@app.route('/')
def serve_index():
    """Serve the main HTML page"""
    return send_from_directory('.', 'index.html')

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        with get_db_connection() as conn:
            cursor = conn.cursor(buffered=True)
            cursor.execute("SELECT 1")
            cursor.fetchone()
            cursor.close()
            db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    # Test AI model connection
    try:
        response = requests.get(AI_CONFIG["url"].replace('/api/generate', '/api/tags'), timeout=5)
        ai_status = "healthy" if response.status_code == 200 else "unhealthy"
    except Exception as e:
        ai_status = f"unhealthy: {str(e)}"
    
    return jsonify({
        "status": "running",
        "database": db_status,
        "database_name": DB_CONFIG["database"],
        "ai_model": ai_status,
        "schema_loaded": len(ACTUAL_SCHEMA) > 0,
        "tables_count": len(ACTUAL_SCHEMA),
        "available_tables": list(ACTUAL_SCHEMA.keys())
    })

if __name__ == '__main__':
    print("🚀 Enhanced AI SQL Server with REAL schema validation")
    print(f"📊 Database: {DB_CONFIG['database']}")
    print("🔗 Main endpoint: http://localhost:5000/ai")
    print("📊 Schema info: http://localhost:5000/schema")
    print("🔍 Discover schema: http://localhost:5000/discover-schema")
    print("🔄 Refresh schema: http://localhost:5000/refresh-schema")
    print("🧪 Test endpoint: http://localhost:5000/test")
    print("❤️ Health check: http://localhost:5000/health")
    print("✅ Using ACTUAL database schema - no more wrong columns!")
    print(f"📋 Loaded {len(ACTUAL_SCHEMA)} tables from database")
    
    app.run(debug=True, port=5000, host='0.0.0.0')