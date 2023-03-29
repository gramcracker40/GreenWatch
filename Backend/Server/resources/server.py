from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import ServerSchema
from models import ServerModel
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from blocklist import BLOCKLIST
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from utilities.rand import rand_string
from datetime import datetime, date, time

blp = Blueprint("server", "server", description="Operations on servers")

@blp.route("/servers")
class Servers(MethodView):
    #@jwt_required()
    @blp.arguments(ServerSchema())
    def post(self, server_data):
        '''
        takes the server data and creates a new server for the greenhouse
        '''

        server = ServerModel(**server_data)

        try:
            db.session.add(server)
            db.session.commit()

        except SQLAlchemyError as err:
            abort(500, message=f"An unhandled server error has occurred -> {err}")

        return {"Success": True}, 201