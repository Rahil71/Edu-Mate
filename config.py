import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY="secret-key"
    password = os.getenv('password_supabase')
    supabase_user=os.getenv('supabase_user')
    supabase_host=os.getenv('supabase_host')
    supabase_port=os.getenv('SUPABASE_DB_PORT')
    supabase_db_name=os.getenv('SUPABASE_DB_NAME')
    SQLALCHEMY_DATABASE_URI = f"postgresql://{supabase_user}:{password}@{supabase_host}:{supabase_port}/{supabase_db_name}?sslmode=require"
    SQLALCHEMY_TRACK_MODIFICATIONS=False
    MAIL_SERVER='smtp.gmail.com'
    MAIL_PORT=587
    MAIL_USE_TLS=True
    MAIL_USERNAME=os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD=os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER=os.getenv('MAIL_USERNAME')