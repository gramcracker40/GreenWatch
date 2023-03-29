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

blp = Blueprint("greenhouse", "greenhouse", description="Operations on greenhouses")

@blp.route("/greenhouse")
class Greenhouse(MethodView):
    #@jwt_required()
    @blp.arguments(GreenhouseSchema())
    def post(self, greenhouse_data):
        '''
        takes the server data and creates a new server for the greenhouse
        '''

        greenhouse = GreenhouseModel(**greenhouse_data)

        try:
            db.session.add(greenhouse)
            db.session.commit()

        except IntegrityError as err:
            abort(400, message="resource already exists, a unique key already exists in data passed. ")

        except SQLAlchemyError as err:
            abort(500, message=f"An unhandled server error has occurred -> {err}")

        return {"Success": True}, 201