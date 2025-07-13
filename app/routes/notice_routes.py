from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.extensions import db
from app.models.notice_model import Notice
from app.models.user_model import User
from ..utils.decorators import role_required
from collections import OrderedDict

notice_bp=Blueprint("notice",__name__)

@notice_bp.route('/post_notice',methods=["POST"])
@jwt_required()
@role_required('admin','teacher')
def post_notice():
    data=request.get_json()
    title=data.get('title')
    message=data.get('message')

    user_id=get_jwt_identity()

    if not title or not message:
        return jsonify({"msg":"Please provide a title and a message"}), 400
    
    new_notice=Notice(
        title=title,
        message=message,
        created_by=user_id
    )

    db.session.add(new_notice)
    db.session.commit()

    return jsonify({"msg":"Notice posted successflly"}), 201

@notice_bp.route('/get_all_notices',methods=["GET"])
@jwt_required()
@role_required('admin','student','teacher')
def get_all_notices():
    notices=Notice.query.all()

    result=[]
    for notice in notices:
        user_identity=User.query.filter(User.id==notice.created_by).first()
        result.append(OrderedDict([
            ("teacher name",user_identity.name),
            ("title",notice.title),
            ("message",notice.message)
        ]))
    
    return jsonify({"notices":result}), 201
