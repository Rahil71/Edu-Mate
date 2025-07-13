from flask import Blueprint,request,jsonify
from app.models.user_model import User
from app.extensions import db
from flask_jwt_extended import create_access_token
from flask_mail import Message
from app.extensions import mail
from datetime import datetime, timedelta, timezone
import uuid

auth_bp=Blueprint("auth",__name__)

@auth_bp.route('/register',methods=["POST"])
def register():
    data=request.get_json()
    name=data.get("name")
    email=data.get("email")
    password=data.get("password")
    role=data.get("role")

    if User.query.filter_by(email=email).first():
        return jsonify({"msg":"User with this email already exists!"}), 409
    
    user=User(name=name,email=email,role=role)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg":"User registered successfully!"}), 201

@auth_bp.route('/login',methods=["POST","GET"])
def login():
    data=request.get_json()
    email=data.get('email')
    password=data.get('password')

    user=User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        # access_token=create_access_token(identity={"id":user.id,"role":user.role},expires_delta=timedelta(days=1))
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role},
            expires_delta=timedelta(days=1)
        )

        return jsonify({"access token":access_token}),200
    else:
        return jsonify({"msg":"Invalid credentials"}),401
    

@auth_bp.route('request_reset',methods=["POST"])
def request_reset():
    data=request.get_json()
    email=data.get('email')

    user=User.query.filter(User.email==email).first()

    if not user.email:
        return jsonify({"msg":"No such mail registered!"}), 404
    
    if user:
        user.reset_token=str(uuid.uuid4())
        # user.reset_token_expiry=datetime.utcnow() + timedelta(minutes=30)
        user.reset_token_expiry=datetime.now(timezone.utc) + timedelta(minutes=30)
        db.session.commit()

        reset_link=f"http://127.0.0.1:5002/auth/reset_password/{user.reset_token}"

        msg=Message("Password reset request",
                    recipients=[user.email],
                    body=f"""
                    Hi {user.name}😃,
                    A request to reset the password was received.
                    Click the link and enter a new password to reset it💁🏻:
                    {reset_link}
                    If you did not requested this mail please ignore this mail!😭
                    """
                )
        mail.send(msg)

        return jsonify({"msg":"A mail has been send to registered email id with reset link"}), 200
    

@auth_bp.route('/reset_password/<token>',methods=["POST"])
def reset_password(token):
    data=request.get_json()
    new_password=data.get('new_password')

    user=User.query.filter(User.reset_token==token).first()

    if not user or user.reset_token_expiry<datetime.now(timezone.utc):
        return jsonify({"msg":"Invalid link / Token expired"}), 400
    
    user.set_password(new_password)
    user.reset_token=None
    user.reset_token_expiry=None
    db.session.commit()

    return jsonify({"msg":"Password reset successful"}), 200