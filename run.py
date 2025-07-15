# run.py
import sys
from app import create_app
from app.extensions import db

app = create_app()

if __name__ == "__main__":
    if "--init-db" in sys.argv:
        with app.app_context():
            print("Creating tables on Supabase...")
            db.create_all()
            print("Tables created successfully!")
    else:
        app.run(debug=True,port=5002)
