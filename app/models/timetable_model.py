from app.extensions import db
from datetime import datetime, timezone

class Timetable(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    uploader_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    batch_id=db.Column(db.Integer,db.ForeignKey('batch.id'),nullable=False)

    is_pdf=db.Column(db.Boolean,default=False)
    pdf_filename=db.Column(db.String(200),nullable=True)

    date=db.Column(db.String(15),nullable=True)
    time=db.Column(db.String(20),nullable=True)
    subject=db.Column(db.String(100),nullable=True)

    created_at=db.Column(db.DateTime,default=datetime.now(timezone.utc))

    uploader=db.relationship('User',backref='uploaded_timetables')
    batch=db.relationship('Batch',backref='timetables')
