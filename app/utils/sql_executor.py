import psycopg2

def execute_sql_query(sql_query):
    try:
        conn = psycopg2.connect(
            dbname="university",
            user="postgres",
            password="RahilShaikh",
            host="localhost",
            port="5432"
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
