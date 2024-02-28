from db import db

class AgentModel(db.Model):
    __tablename__ = "agent"

    #attributes
    id = db.Column(db.Integer, unique=True, primary_key=True)
    private_key = db.Column(db.String, unique=True, nullable=False)
    ip_address = db.Column(db.String, nullable=False) # server ip address
    device_ip_address = db.Column(db.String, nullable=True) # device ip address
    status = db.Column(db.Integer, nullable=False) # 0 - off, 1 - on, 2 - rebooting
    duration = db.Column(db.Time, nullable=False)

    #foreign keys 
    room_id = db.Column(db.Integer, db.ForeignKey("room.id"), nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey("server.id"), nullable=False)
    
    #relationships
    room = db.relationship("RoomModel", back_populates="agent")
    server = db.relationship("ServerModel", back_populates="agents")
