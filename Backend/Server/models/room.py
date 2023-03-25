from db import db


class RoomModel(db.Model):
    __tablename__ = "room"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    room_key_public = db.Column(db.String(30), nullable=False)
    room_key_private = db.Column(db.String(60), nullable=False)
    
    experiments = db.relationship("ExperimentModel", back_populates="room", lazy=True)
    measurements = db.relationship("MeasurementModel", back_populates="room", lazy=True)
    messages = db.relationship("MessageModel", back_populates="room", lazy=True)


