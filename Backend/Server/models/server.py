from db import db

class ServerModel(db.Model):
    __tablename__ = "server"

    #attributes - made during the server executable start up process. 
    id = db.Column(db.Integer, unique=True, primary_key=True)
    ip_address = db.Column(db.String, unique=True, nullable=False)
    name = db.Column(db.String, unique=True, nullable=False)

    #foreign keys 
    greenhouse_id = db.Column(db.Integer, db.ForeignKey("greenhouse.id"), nullable=False)
    
    #relationships
    greenhouse = db.relationship("GreenhouseModel", back_populates="servers")
    agents = db.relationship("AgentModel", back_populates="server")