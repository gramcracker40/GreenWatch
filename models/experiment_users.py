from db import db

class ExperimentUsersModel(db.Model):
    __tablename__ = "experiment_users"

    id = db.Column(db.Integer, primary_key=True)
    experiment_id = db.Column(db.Integer, db.ForeignKey("experiment.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
