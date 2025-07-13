from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.leave_model import LeaveRequest
from app.models.user_model import User
from app.utils.decorators import role_required

leave_bp=Blueprint('leave',__name__)

@leave_bp.route('/apply',methods=['POST'])
@jwt_required()
@role_required('student')
def apply_leave():
    data=request.get_json()
    reason=data.get('reason')

    if not reason:
        return jsonify({"msg":"Enter a reason"}), 400
    
    student_id=get_jwt_identity()

    leave=LeaveRequest(
        student_id=student_id,
        reason=reason
    )

    db.session.add(leave)
    db.session.commit()

    return jsonify({"msg":"Successfully applied for leave"}), 200

@leave_bp.route('/view_all_applications',methods=['GET'])
@jwt_required()
@role_required('admin','teacher')
def view_all_applications():
    applications=LeaveRequest.query.all()
    result=[]
    for application in applications:
        student=User.query.filter(User.id==application.id).first()
        result.append({
            "application id":application.id,
            "student name":student.name,
            "reason":application.reason
        })
    
    return jsonify(result), 200


@leave_bp.route('/update_application_status/<int:leave_id>',methods=["PUT"])
@jwt_required()
@role_required('admin','teacher')
def update_application_status(leave_id):
    data=request.get_json()
    status=data.get('status').strip().lower()

    if status not in ['approved','rejected']:
        return jsonify({"msg","Status of the application should be either approved or rejected"}), 400
    
    leave=LeaveRequest.query.filter(LeaveRequest.id==leave_id).first()

    leave.status=status
    db.session.commit()

    return jsonify({"msg":f"Application status turned to {leave.status} for leave id {leave_id}"}),200
