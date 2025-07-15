import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    api_key=groq_api_key,
    model="llama3-70b-8192"
)

schema_prompt = """
You are an AI assistant that generates SQL queries based on user questions and only returns the exact query.
Only return queries for general, non-sensitive information.

If the user asks for sensitive information like:
- passwords or password hashes
- reset tokens
- confidential fee details of other users
- admin information
- emails or names of all users
- phone numbers or contact details

Respond with:
-- I'm sorry, I do not have access to that information.

Never return any SQL for such cases.

Always use public."user" when querying the user table. Here's the schema:

Table: user  
Columns:  
- id (int, PK)  
- name (str)  
- email (str, unique)  
- password_hash (str)  
- role (str: admin | teacher | student)  
- batch_id (FK to batch.id)  
- reset_token (str)  
- reset_token_expiry (datetime)

Table: batch  
Columns:  
- id (int, PK)  
- name (str, unique)

Table: teacher_batch (association table)  
Columns:
- teacher_id (FK to user.id)  
- batch_id (FK to batch.id)

Table: fee  
Columns:  
- id (int, PK)  
- student_id (FK to user.id)  
- academic_year (str)  
- amount (float)  
- status (str: pending/paid)  
- payment_date (datetime)  
- is_enabled (bool)

Table: attendance  
Columns:  
- id (int, PK)  
- student_id (FK to user.id)  
- date (date)  
- status (str: present/absent)  
- marked_by (FK to user.id)

Table: leave_request  
Columns:  
- id (int, PK)  
- student_id (FK to user.id)  
- reason (text)  
- status (str: pending/approved/rejected)  
- created_at (datetime)

Table: notice  
Columns:  
- id (int, PK)  
- title (str)  
- message (str)  
- created_by (FK to user.id)  
- created_at (datetime)

Table: timetable  
Columns:  
- id (int, PK)  
- uploader_id (FK to user.id)  
- batch_id (FK to batch.id)  
- is_pdf (bool)  
- pdf_filename (str)  
- date (str)  
- time (str)  
- subject (str)  
- created_at (datetime)

Table: mark  
Columns:
- id (int, PK)
- student_id (FK to user.id)
- teacher_id (FK to user.id)
- teacher_name (str)
- subject (str)
- score (float)
- remark (str)
"""

BLOCKED_KEYWORDS = [
    "password", "hash", "token", "reset", "admin", "all users", "list of students",
    "email of all", "contact", "phone", "fee of", "pending fees", "secret"
]

def contains_blocked_keywords(user_query: str) -> bool:
    query_lower = user_query.lower()
    return any(keyword in query_lower for keyword in BLOCKED_KEYWORDS)

def generate_sql_from_text(user_query):
    if contains_blocked_keywords(user_query):
        return "-- I'm sorry, I do not have access to that information."

    messages = [
        SystemMessage(content="""
You are an AI assistant that converts user questions into SQL queries.
Only return queries for general, non-sensitive information.

If the user asks for sensitive information like:
- passwords or password hashes
- reset tokens
- confidential fee details of other users
- admin information
- emails or names of all users
- phone numbers or contact details

Respond with:
-- I'm sorry, I do not have access to that information.

Never return any SQL for such cases.

You are just a helpful assistant, not a database administrator.
"""),
        HumanMessage(content=f"{schema_prompt}\n\nUser Question: {user_query}\nSQL:")
    ]

    response = llm.invoke(messages)
    return response.content.strip()
