from app.extensions import db
# from sqlalchemy.types import DateTime

class Fee(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    student_id=db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    academic_year=db.Column(db.String(15),nullable=False)
    amount=db.Column(db.Float,nullable=False)
    status=db.Column(db.String(20),default='pending')
    payment_date=db.Column(db.DateTime(timezone=True))
    is_enabled=db.Column(db.Boolean, default=True)
    student=db.relationship("User",backref="fees")