from app.extensions import db

class Batch(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(100),nullable=False,unique=True)
    students=db.relationship("User",backref="batch",lazy=True)
    teacher=db.relationship('User',secondary='teacher_batch',back_populates='teaching_batches')