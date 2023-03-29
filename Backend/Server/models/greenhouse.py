from db import db


class GreenhouseModel(db.Model):
    __tablename__ = "greenhouse"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    location = db.Column(db.String(100))
    
    rooms = db.relationship("RoomModel", back_populates="greenhouse", lazy=True, cascade="all, delete")
    servers = db.relationship("ServerModel", back_populates="greenhouse", lazy=True, cascade="all, delete")