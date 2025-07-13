from app.extensions import db
from datetime import datetime, timezone

class LeaveRequest(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    student_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    reason=db.Column(db.Text,nullable=False)
    status=db.Column(db.String(15),default='pending')
    created_at=db.Column(db.DateTime,default=datetime.now(timezone.utc))
    student=db.relationship('User',backref='leave_requests')
