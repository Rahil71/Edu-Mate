from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.types import DateTime

class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(100),nullable=False)
    email=db.Column(db.String(100),unique=True,nullable=False)
    password_hash=db.Column(db.String(200),nullable=False)
    role=db.Column(db.String(50),nullable=False)
    batch_id=db.Column(db.Integer,db.ForeignKey('batch.id'),nullable=True)
    teaching_batches=db.relationship('Batch',secondary='teacher_batch',back_populates='teacher')
    reset_token=db.Column(db.String(200),nullable=True,unique=True)
    reset_token_expiry=db.Column(DateTime(timezone=True),nullable=True)

    def set_password(self,password):
        self.password_hash=generate_password_hash(password)

    def check_password(self,password):
        return check_password_hash(self.password_hash,password)
    