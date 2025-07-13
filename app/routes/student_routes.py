from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required, get_jwt
from app.models.user_model import User
from app.models.mark_model import Mark
from app.models.fee_model import Fee
from app.models.timetable_model import Timetable
from app.extensions import db
from ..utils.decorators import role_required

student_bp=Blueprint("student",__name__)


@student_bp.route('/get_marks',methods=["GET"])
@jwt_required()
@role_required('student')
def get_marks():
    student_id=get_jwt_identity()
    marks=Mark.query.filter(Mark.student_id==student_id).all()

    result=[]
    for mark in marks:
        result.append({
            "subject":mark.subject,
            "score":mark.score,
            "remark":mark.remark,
            "teacher name":mark.teacher_name
        })

    return jsonify(result), 200


@student_bp.route('/check_fees_status',methods=["GET"])
@jwt_required()
@role_required('student')
def check_fees_status():
    student_id=get_jwt_identity()
    year='2024-25'

    fee=Fee.query.filter(Fee.student_id==student_id, Fee.academic_year==year).first()

    if not fee or not fee.is_enabled:
        return jsonify({"show_scanner":False,"msg":"Payment not allowed"}), 200
    
    if fee.status=='paid':
        return jsonify({"show_scanner":False,"msg":"Fees already paid"}), 201
    
    return jsonify({"show_scanner":False,"msg":f"Amount to be paid {fee.amount}"})


@student_bp.route('/get_timetable',methods=["GET"])
@jwt_required
@role_required('student')
def get_timetable():
    user_id=get_jwt_identity()
    user=User.query.get(user_id)

    if not user.batch_id:
        return jsonify({"msg":"No batch has been assigned yet"}), 400
    
    timetables=Timetable.query.filter(Timetable.batch_id==user.batch_id).all()

    if not timetables:
        return jsonify({"msg":f"No timetable has been uploaded yet for batch {user.batch_id}"}), 404
    
    result=[]

    for tt in timetables:
        if tt.is_pdf:
            result.append({
                "type":"pdf",
                "filename":tt.pdf_filename,
                "uploaded_by":tt.uploader.name,
                "uploaded_at":tt.created_at.strftime("%Y-%m-%d %H:%M")
            })
        else:
            result.append({
                "type":"structured",
                "subject":tt.subject,
                "date":tt.date,
                "time":tt.time,
                "uploaded_by":tt.uploader.name,
                "uploaded_at":tt.created_at.strftime("%Y-%m-%d %H:%M")
            })
        
    return jsonify(result), 200
