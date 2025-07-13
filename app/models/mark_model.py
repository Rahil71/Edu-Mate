from app.extensions import db

class Mark(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    student_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    teacher_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    teacher_name=db.Column(db.String(100),nullable=False)
    subject=db.Column(db.String(100),nullable=False)
    score=db.Column(db.Float,nullable=False)
    remark=db.Column(db.String(100),nullable=True)

    student=db.relationship("User",foreign_keys=[student_id],backref="marks_received")
    teacher=db.relationship("User",foreign_keys=[teacher_id],backref="marks_given")
