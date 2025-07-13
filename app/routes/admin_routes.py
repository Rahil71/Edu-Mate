from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.models.user_model import User
from app.models.batch_model import Batch
from app.models.mark_model import Mark
from app.models.teacher_batch_model import teacher_batch
from app.models.fee_model import Fee
from app.extensions import db
from sqlalchemy import func
from ..utils.decorators import role_required

admin_bp=Blueprint("admin",__name__)

def is_admin():
    # user_identity=get_jwt_identity()
    # return user_identity.get('role')=='admin'
    # auth_routes.py - line 37
    # https://github.com/vimalloc/flask-jwt-extended/issues/557
    claims = get_jwt()
    return claims.get('role') == 'admin'

def is_teacher():
    claims=get_jwt()
    return claims.get('role')=='teacher'

@admin_bp.route("/create_batch",methods=["POST","GET"])
@jwt_required()
def create_batch():
    if not is_admin():
        return jsonify({"msg":"Admins Only"}), 403
    
    data=request.get_json()
    name=data.get("name")

    if Batch.query.filter_by(name=name).first():
        return jsonify({"msg":"Batch with the same name already exists!"}), 409
    
    batch=Batch(name=name)
    db.session.add(batch)
    db.session.commit()

    return jsonify({"msg":"Batch created"}), 201


@admin_bp.route("/assign_batch",methods=["POST","GET"])
@jwt_required()
def assign_batch():
    if not is_admin():
        return jsonify({"msg":"Admins Only!"}), 403
    
    data=request.get_json()
    batch_name=data.get("batch_name")
    students_ids=data.get("student_ids",[])
    students_names=data.get("students_names",[])

    if not batch_name:
        return jsonify({"msg":"Batch name is required"}), 409

    batch=Batch.query.filter(func.lower(Batch.name)==batch_name.lower()).first()

    if not batch:
        return jsonify({"msg":"No such batch exists!"}), 404
    
    assigned=[]
    skipped=[]
    
    for sid in students_ids:
        student=User.query.get(sid)
        if student and student.role=="student":
            student.batch_id=batch.id
            assigned.append(student.email)
        else:
            skipped.append({"type":"id","value":sid})

    for name in students_names:
        student=User.query.filter(func.lower(User.name)==name.lower()).first()
        if student and student.role=="student":
            student.batch_id=batch.id
            assigned.append(student.email)
        else:
            skipped.append({"type":"name","value":name})

    db.session.commit()

    return jsonify({"msg":"Batch assigned to students!"}), 201


@admin_bp.route("/assign_batch_teacher",methods=["POST"])
@jwt_required()
def assign_batch_teacher():
    if not is_admin():
        return jsonify({"msg":"Only admins are allowed"}), 403
    
    data=request.get_json()

    batch_name=data.get('batch_name')
    teacher_name=data.get('teacher_name')

    batch=Batch.query.filter(func.lower(Batch.name)==batch_name.lower()).first()
    teacher=User.query.filter(func.lower(User.name)==teacher_name.lower()).first()

    if not batch:
        return jsonify({"msg":"No such batch exists!"}), 404
    
    if not teacher:
        return jsonify({"msg":"Provide firstname + lastname / No such teacher exists!"}), 404
    
    if teacher in batch.teacher:
        return jsonify({"msg":"Teacher already assigned"}), 201
    
    batch.teacher.append(teacher)

    db.session.commit()

    return jsonify({"msg":f"Assigned {teacher.name} to {batch.name}"}), 200


@admin_bp.route('/force-reset',methods=["POST"])
@jwt_required()
def force_reset():
    if not is_admin():
        return jsonify({"msg":"Only admins are allowed"}), 403

    data=request.get_json()
    name=data.get('user_name')
    email=data.get('user_email')
    new_password=data.get('new_passsword')

    user=User.query.filter(User.email==email).first()
    if not user:
        return jsonify({"msg":"No such user"}), 404
    
    user.set_password(new_password)

    db.session.commit()
    return jsonify({"msg":f"Password changed for {name}"})


@admin_bp.route('/get_marks',methods=["GET"])
@jwt_required()
@role_required('admin')
def get_marks():
    marks=Mark.query.all()
    result=[]

    for mark in marks:
        student=User.query.filter(User.id==mark.student_id).first()
        result.append({
            "student name":student.name,
            "teacher name":mark.teacher_name,
            "subject":mark.subject,
            "score":mark.score,
            "remark":mark.remark
        })

    return jsonify(result), 200


@admin_bp.route("/all_batches",methods=["GET"])
@jwt_required()
@role_required('admin')
def all_batches():
    batches=Batch.query.all()
    result=[]
    for batch in batches:
        result.append({
            "batch id":batch.id,
            "batch name":batch.name
        })
    
    return jsonify(result), 200


@admin_bp.route("/teacher_batches",methods=["GET"])
@jwt_required()
@role_required('admin')
def teacher_batches():
    teachers=User.query.filter(User.role=='teacher').all()
    result=[]
    for teacher in teachers:
        result.append({
            "teacher id":teacher.id,
            "teacher name":teacher.name,
            "batches":[x.name for x in teacher.teaching_batches]
        })
    
    return jsonify(result), 200


@admin_bp.route('/toggle_fees',methods=["POST"])
@jwt_required()
@role_required('admin')
def toggle_fees():
    data=request.get_json()
    student_id=data.get('student_id')
    academic_yr=data.get('academic_yr')
    enable=data.get('enable')

    fee=Fee.query.filter(Fee.student_id==student_id,Fee.academic_year==academic_yr).first()
    student=User.query.filter(User.id==student_id).first()

    if not fee:
        return jsonify({"msg":f"No record found for {student.name}"}), 404
    
    fee.is_enabled=enable
    db.session.commit()

    return jsonify({"msg":f"Fees {'enabled' if enable else 'disabled'} for {student.name}"}), 201


@admin_bp.route('/create_fee_one',methods=["POST"])
@jwt_required()
@role_required('admin')
def create_fee_one():
    data=request.get_json()
    student_id=data.get('student_id')
    academic_yr=data.get('academic_yr')
    amount=data.get('amount')
    status=data.get('status')

    existing=Fee.query.filter(Fee.student_id==student_id,Fee.academic_year==academic_yr).first()

    if existing:
        return jsonify({"msg":"Fee record already exists!"}), 409
    
    fee=Fee(
        student_id=student_id,
        academic_year=academic_yr,
        amount=amount,
        status=status
    )

    db.session.add(fee)
    db.session.commit()

    return jsonify({"msg":"Fee record created"}), 200


@admin_bp.route('/create_bulk_fee',methods=["POST"])
@jwt_required()
@role_required('admin')
def create_bulk_fee():
    data=request.get_json()
    student_ids=data.get('student_ids')
    academic_yr=data.get('academic_yr')
    amount=data.get('amount')
    status=data.get('status')

    if not student_ids or not isinstance(student_ids,list):
        return jsonify({"msg":"Please provide a valid list of students"}), 400
    
    created=[]
    skipped=[]

    for student_id in student_ids:
        existing=Fee.query.filter(Fee.student_id==student_id,Fee.academic_year==academic_yr).first()
        if existing:
            skipped.append(student_id)
            continue

        fee=Fee(
            student_id=student_id,
            academic_year=academic_yr,
            amount=amount,
            status=status
        )

        db.session.add(fee)
        created.append(student_id)

    db.session.commit()

    return jsonify({"msg":"Bulk fee record created","Created for":created,"Skipped":skipped}), 201


@admin_bp.route('update_fee',methods=["PUT"])
@jwt_required()
@role_required('admin')
def update_fee():
    data=request.get_json()
    student_ids=data.get('student_ids')
    if not student_ids or not isinstance(student_ids,list):
        return jsonify({"msg":"Provide a valid list of students"}), 400
    
    update_fields={}
    for field in ['academic_year','amount','status','is_enabled']:
        if field in data:
            update_fields[field]=data[field]

    if not update_fields:
        return jsonify({"msg":"No valid fields to update"}), 400
    
    updated, not_found=[],[]

    for sid in student_ids:
        fee=Fee.query.filter(Fee.student_id==sid).first()
        if fee:
            for key, value in update_fields.items():
                setattr(fee,key,value)
            updated.append(sid)
        else:
            not_found.append(sid)
    
    db.session.commit()

    return jsonify({"msg":"Fee records updated!","updated":updated,"not found":not_found}), 200


@admin_bp.route('/student_in_all_batch',methods=['GET'])
@jwt_required()
@role_required('admin')
def students_in_all_batch():
    batches=Batch.query.all()

    result=[]

    for batch in batches:
        students=User.query.filter(User.batch_id==batch.id,User.role=='student').all()
        student_names=[a.name for a in students]
        result.append({
            "batch":batch.name,
            "student name":student_names
        })
    
    return jsonify(result), 200


@admin_bp.route('/student_in_specifc_batch',methods=['POST'])
@jwt_required()
@role_required('admin')
def student_in_specific_batch():
    data=request.get_json()
    batch_name=data.get('batch_name',[]).strip().lower()

    if not batch_name:
        return jsonify({"msg":"Batch name is required"}), 400
    
    batchh=Batch.query.filter(db.func.lower(Batch.name)==batch_name).first()

    if not batchh:
        return jsonify({"msg":"No such batch exists!"}), 404
    
    students=User.query.filter(User.batch_id==batchh.id,User.role=='student').all()
    student_names=[x.name for x in students]

    return jsonify({"batch name":batch_name,"Students":student_names}), 201
