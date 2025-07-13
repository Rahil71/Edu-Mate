from app.extensions import db
from datetime import datetime, timezone

class Attendance(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    student_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    date=db.Column(db.Date, default=datetime.now(timezone.utc),nullable=False)
    status=db.Column(db.String(10),nullable=False)
    marked_by=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)

    student=db.relationship('User',foreign_keys=[student_id],backref='attendances')
    marker=db.relationship('User',foreign_keys=[marked_by])
