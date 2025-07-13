from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models.timetable_model import Timetable
from app.models.user_model import User
from app.models.batch_model import Batch
from app.utils.decorators import role_required
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from werkzeug.utils import secure_filename
from datetime import datetime, timezone
import os

timetable_bp=Blueprint('timetable',__name__)

UPLOAD_FOLDER=os.path.join('app','static','uploaded_timetables')
os.makedirs(UPLOAD_FOLDER,exist_ok=True)

@timetable_bp.route('/upload_timetable_pdf',methods=["POST"])
@jwt_required()
@role_required('admin','teacher')
def upload_timetable_pdf():
    file=request.files.get('pdf')
    batch_id=request.form.get('batch_id')

    if not file or not batch_id:
        return jsonify({"msg":"Valid File and Batch ID are required"}), 400
    
    filename=secure_filename(file.filename)
    filepath=os.path.join(UPLOAD_FOLDER,filename)

    file.save(filepath)

    new_timetable=Timetable(
        uploader_id=get_jwt_identity(),
        batch_id=batch_id,
        is_pdf=True,
        pdf_filename=filename
    )

    db.session.add(new_timetable)
    db.session.commit()

    return jsonify({"msg":"Timetable uploaded successfully"}), 201


@timetable_bp.route('/upload_structured_timetable',methods=["POST"])
@jwt_required()
@role_required('admin','teacher')
def upload_structured_timetable():
    data=request.get_json()
    batch_id=data.get('batch_id')
    entries=data.get('entries',[])

    if not batch_id or not entries:
        return jsonify({"msg":"Enter valid Batch ID and entries"}), 400
    
    batch=Batch.query.filter(Batch.id==batch_id).first()

    if not batch:
        return jsonify({"msg":f"Batch with batch id: {batch_id} does not exist"}), 400
    
    uploader_id=get_jwt_identity()

    for entry in entries:
        new_timetable=Timetable(
            uploader_id=uploader_id,
            batch_id=batch_id,
            date=entry.get('date'),
            time=entry.get('time'),
            subject=entry.get('subject'),
            is_pdf=False
        )
        db.session.add(new_timetable)

    db.session.commit()

    return jsonify({"msg":"Data entered successfully for time table"}), 201
