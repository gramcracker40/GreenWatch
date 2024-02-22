from db import db

class ActionModel(db.Model):
    __tablename__ = "action"
    
    #attributes
    id = db.Column(db.Integer, unique=True, primary_key=True)

    # status: 0 - Unfulfilled, 1 - Queued, 2 - In Progress, 3 - Fulfilled, -1 - Failed
    status = db.Column(db.Integer, nullable=True)

    # stop: 0 - Do not stop, 1 - Stop ### Stops measurements    
    stop = db.Column(db.Integer, nullable=True)

    # vent_state: 0 - Open, 1 - Closed, 2 - Moving, 3 - Unknown
    vent_state = db.Column(db.Integer, nullable=True)

    # shade_state: 0 - Open, 1 - Closed, 2 - Moving, 3 - Unknown
    shade_state = db.Column(db.Integer, nullable=True)

    # reboot: 0 - Do not reboot, 1 - Reboot
    reboot = db.Column(db.Integer, nullable=True)
    
    timestamp = db.Column(db.DateTime, nullable=True)

    #foreign keys
    room_id = db.Column(db.Integer, db.ForeignKey("room.id"), nullable=False)
    
    #relationships
    room = db.relationship("RoomModel", back_populates="actions")

    
