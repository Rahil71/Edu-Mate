import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def execute_sql_query(sql_query):
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('SUPABASE_DB_NAME'),
            user=os.getenv('supabase_user'),
            password=os.getenv('password_supabase'),
            host=os.getenv('supabase_host'),
            port=os.getenv('SUPABASE_DB_PORT'),
            sslmode='require'
        )
        cur = conn.cursor()
        cur.execute(sql_query)
        rows = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
        result = [dict(zip(colnames, row)) for row in rows]
        cur.close()
        conn.close()
        return result
    except Exception as e:
        return {"error": str(e)}
