from db import db

class MessageModel(db.Model):
    __tablename__ = "message"

    id = db.Column(db.Integer, unique=True, primary_key=True)
    body = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey("room.id"), nullable=False)

    user = db.relationship("UserModel", back_populates="messages")
    room = db.relationship("RoomModel", back_populates="messages")


