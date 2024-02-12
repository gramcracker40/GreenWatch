from db import db

class ActionModel(db.Model):
    __tablename__ = "action"
    
    #attributes
    id = db.Column(db.Integer, unique=True, primary_key=True)

    vent_state = db.Column(db.Integer, nullable=True)
    shade_state = db.Column(db.Integer, nullable=True)
    
    timestamp = db.Column(db.DateTime, nullable=True)

    #foreign keys
    room_id = db.Column(db.Integer, db.ForeignKey("room.id"), nullable=False)
    
    #relationships
    room = db.relationship("RoomModel", back_populates="actions")

    
