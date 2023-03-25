from db import db


class UserModel(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(30), nullable=False)

    first_name = db.Column(db.String(60), nullable=False)
    last_name = db.Column(db.String(60), nullable=False)

    is_admin = db.Column(db.Boolean)
    email = db.Column(db.String, unique=True, nullable=False)

    experiments = db.relationship("ExperimentModel", back_populates="users", lazy=True)
    messages = db.relationship("MessageModel", back_populates="users", lazy=True)


