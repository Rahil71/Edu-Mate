from app.extensions import db
from datetime import timezone, datetime

class Notice(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    title=db.Column(db.String(100),nullable=False)
    message=db.Column(db.String(100),nullable=False)
    created_by=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    created_at=db.Column(db.DateTime,default=datetime.now(timezone.utc))

    creator=db.relationship('User',backref='notices')
