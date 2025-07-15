from flask import Blueprint, request, jsonify
from app.utils.text_to_sql_engine import generate_sql_from_text
from app.utils.sql_executor import execute_sql_query

text_sql_bp = Blueprint("text_sql", __name__)

SENSITIVE_FIELDS = {"password_hash", "reset_token", "reset_token_expiry"}

def clean_result(result):
    if isinstance(result, list):
        for row in result:
            for key in list(row.keys()):
                if key in SENSITIVE_FIELDS:
                    row[key] = "[REDACTED]"
    return result

@text_sql_bp.route("/text_to_sql", methods=["POST"])
def text_to_sql_route():
    data = request.get_json()
    user_query = data.get("query", "")

    if not user_query:
        return jsonify({"error": "Query not provided"}), 400

    sql_query = generate_sql_from_text(user_query)
    print("Generated SQL:", sql_query)

    if sql_query.startswith("I'm sorry"):
        return jsonify({"sql": None, "result": sql_query})

    result = execute_sql_query(sql_query)
    result = clean_result(result)

    return jsonify({"sql": sql_query, "result": result})
