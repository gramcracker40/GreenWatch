from db import db

class MeasurementModel(db.Model):
    __tablename__ = "measurement"
    
    #attributes
    id = db.Column(db.Integer, unique=True, primary_key=True)

    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    light = db.Column(db.Float, nullable=False)
    pressure = db.Column(db.Float, nullable=False)
    
    timestamp = db.Column(db.DateTime, nullable=False)

    #relationships
    room_id = db.Column(db.Integer, db.ForeignKey("room.id"), nullable=False)
    experiment_id = db.Column(db.Integer, db.ForeignKey("experiment.id"))
