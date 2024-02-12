from db import db


class RoomModel(db.Model):
    __tablename__ = "room"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    greenhouse_id = db.Column(db.Integer, db.ForeignKey("greenhouse.id"), nullable=False)
    
    experiments = db.relationship("ExperimentModel", back_populates="room", lazy=True, cascade="all, delete")
    measurements = db.relationship("MeasurementModel", back_populates="room", lazy=True, cascade="all, delete")
    messages = db.relationship("MessageModel", back_populates="room", lazy=True, cascade="all, delete")
    agent = db.relationship("AgentModel", back_populates="room", lazy=True, cascade="all, delete")
    greenhouse = db.relationship("GreenhouseModel", back_populates="rooms")
    actions = db.relationship("ActionModel", back_populates="room", lazy=True, cascade="all, delete")
