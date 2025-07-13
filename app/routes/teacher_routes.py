from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from flask import Blueprint, request, jsonify
from app.models.user_model import User
from app.models.mark_model import Mark
from app.extensions import db
from ..utils.decorators import role_required

teacher_bp=Blueprint("teacher",__name__)

@teacher_bp.route('/upload-marks',methods=["POST"])
@jwt_required()
def upload_marks():
    claims=get_jwt()
    if claims['role']!='teacher':
        return jsonify({"msg","Only teachers are allowed"}), 403
    
    data=request.get_json()

    student_id=data.get('student_id')
    subject=data.get('subject').strip().lower()
    score=data.get('score')
    remark=data.get('remark')

    student=User.query.filter(User.id==student_id,User.role=='student').first()

    if not student:
        return jsonify({"msg":"Not a valid student id"}), 404

    if not student.batch:
        return jsonify({"msg":"Student is not assigned to any batch"}), 400
    
    teacher_id=get_jwt_identity()
    teacher=User.query.get(teacher_id)

    allowed_subjects=[batch.name.lower() for batch in teacher.teaching_batches]

    if subject not in allowed_subjects:
        return jsonify({"msg":"You are not assigned for this subject"}), 403

    # mark=Mark(
    #     student_id=student.id,
    #     teacher_id=teacher_id,
    #     subject=subject,
    #     score=score,
    #     remark=remark,
    #     teacher_name=teacher.name
    # )

    existing_mark=Mark.query.filter(Mark.student_id==student_id,Mark.teacher_id==teacher_id,Mark.subject==subject).first()

    if existing_mark:
        existing_mark.score=score
        existing_mark.remark=remark
        student=User.query.filter(User.id==Mark.student_id).first()
        msg=f"Marks updated successfully for {student.name} by {teacher.name}"
    else:
        new_mark=Mark(
            student_id=student.id,
            teacher_id=teacher_id,
            subject=subject,
            score=score,
            remark=remark,
            teacher_name=teacher.name
        )
        db.session.add(new_mark)
        msg="Marks uploaded successfully"

    db.session.commit()

    return jsonify({"msg":msg}), 201

@teacher_bp.route('/get_marks',methods=["GET"])
@jwt_required()
@role_required('teacher')
def get_marks():
    teacher_id=get_jwt_identity()
    marks=Mark.query.filter(Mark.teacher_id==teacher_id).all()

    result=[]
    for mark in marks:
        student=User.query.get(mark.student_id)
        result.append({
            "student_name":student.name,
            "subject":mark.subject,
            "score":mark.score,
            "remark":mark.remark
        })

    return jsonify(result), 200