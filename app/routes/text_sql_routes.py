from flask import Blueprint, request, jsonify
from app.utils.text_to_sql_engine import generate_sql_from_text
from app.utils.sql_executor import execute_sql_query

text_sql_bp = Blueprint("text_sql", __name__)

@text_sql_bp.route("/text_to_sql", methods=["POST"])
def text_to_sql_route():
    data = request.get_json()
    user_query = data.get("query", "")

    if not user_query:
        return jsonify({"error": "Query not provided"}), 400

    sql_query = generate_sql_from_text(user_query)
    print("Generated SQL:", sql_query)

    result = execute_sql_query(sql_query)
    return jsonify({"sql": sql_query, "result": result})
