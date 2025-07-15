from flask import Flask, jsonify
from flask_cors import CORS
from .extensions import db,jwt
from .routes.auth_routes import auth_bp
from .routes.admin_routes import admin_bp
from .routes.teacher_routes import teacher_bp
from .routes.student_routes import student_bp
from .routes.timetable_routes import timetable_bp
from .routes.leave_routes import leave_bp
from.routes.notice_routes import notice_bp
from .routes.attendance_routes import attendance_bp
from flask_migrate import Migrate
from .routes.text_sql_routes import text_sql_bp
from app.models import *
from .extensions import mail
import threading

migrate=Migrate()

def create_app():
    app=Flask(__name__)
    app.config.from_object("config.Config")
    CORS(app, resources={r"/*": {"origins": "*"}})
    migrate.init_app(app,db)
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    app.register_blueprint(auth_bp,url_prefix="/auth")
    app.register_blueprint(admin_bp,url_prefix="/admin")
    app.register_blueprint(teacher_bp,url_prefix="/teacher")
    app.register_blueprint(student_bp,url_prefix="/student")
    app.register_blueprint(timetable_bp,url_prefix="/timetable")
    app.register_blueprint(leave_bp,url_prefix='/leave')
    app.register_blueprint(notice_bp,url_prefix='/notice')
    app.register_blueprint(attendance_bp,url_prefix='/attendance')
    app.register_blueprint(text_sql_bp,url_prefix='/chat')

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"msg":"Internal server error"}), 500
    
    return app
