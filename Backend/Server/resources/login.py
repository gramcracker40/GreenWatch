from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import GreenhouseSchema
from models import GreenhouseModel
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from blocklist import BLOCKLIST
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from utilities.rand import rand_string
from datetime import datetime, date, time

blp = Blueprint("login", "login", description="provides login.html to root route on site")

login_html = open("UserInterface/")

@blp.route("/")
class LoginPage(MethodView):

    def get(self):
        