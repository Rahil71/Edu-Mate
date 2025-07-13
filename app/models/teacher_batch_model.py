from app.extensions import db

teacher_batch=db.Table(
    "teacher_batch",
    db.Column("teacher_id",db.Integer,db.ForeignKey('user.id')),
    db.Column("batch_id",db.Integer,db.ForeignKey('batch.id'))
    )