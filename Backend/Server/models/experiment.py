from db import db

class ExperimentModel(db.Model):
    __tablename__ = "experiment"
    
    #attributes
    id = db.Column(db.Integer, unique=True, primary_key=True)
    name = db.Column(db.String, unique=True)

    upper_temp = db.Column(db.Float(precision=2), nullable=False)
    lower_temp = db.Column(db.Float(precision=2), nullable=False)
    
    lower_hum = db.Column(db.Float(precision=2), nullable=False)
    upper_hum = db.Column(db.Float(precision=2), nullable=False)
    
    average_light = db.Column(db.Float(precision=2), nullable=False)
    average_pressure = db.Column(db.Float(precision=2), nullable=False)
    average_temp = db.Column(db.Float(precision=2), nullable=False)
    average_humidity = db.Column(db.Float(precision=2), nullable=False)

    start = db.Column(db.DateTime, nullable=False)
    end = db.Column(db.DateTime, nullable=False)

    time_spent_outside = db.Column(db.Time, nullable=False)
    alert_on = db.Column(db.Boolean, nullable=False)
    active = db.Column(db.Boolean, nullable=False)

    #foreign keys
    room_id = db.Column(db.Integer, db.ForeignKey("room.id"))
    
    #relationships
    room = db.relationship("RoomModel", back_populates="experiments")
    users = db.relationship("UserModel", back_populates="experiments", secondary="experiment_users")
    measurements = db.relationship("MeasurementModel", back_populates="experiment")

