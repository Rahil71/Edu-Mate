from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, get_jwt, jwt_required
from app.extensions import db
from app.models.user_model import User
from app.models.attendance_model import Attendance
from app.utils.decorators import role_required

attendance_bp=Blueprint('attendace',__name__)

@attendance_bp.route('/mark_attendance',methods=['POST'])
@jwt_required()
@role_required('teacher','admin')
def mark_attendance():
    data=request.get_json()
    records=data.get('records',[])

    if not records:
        return jsonify({'msg':'Please provide attendance record'}), 400
    
    user_id=get_jwt_identity()
    
    for record in records:
        new_attendance=Attendance(
            student_id=record['student_id'],
            status=record['status'],
            marked_by=user_id
        )
        db.session.add(new_attendance)
    
    db.session.commit()

    return jsonify({'msg':'Successfully marked the attendance'}), 201

@attendance_bp.route('/view_attendance',methods=['GET'])
@jwt_required()
@role_required('admin','student','teacher')
def view_attendance():
    user_id=get_jwt_identity()

    records=Attendance.query.filter(Attendance.student_id==user_id).all()
    result=[]
    for record in records:
        result.append({
            "date":record.date.strftime("%d-%m-%Y"),
            "status":record.status
        })
    
    return jsonify({"attendance":result}), 201
