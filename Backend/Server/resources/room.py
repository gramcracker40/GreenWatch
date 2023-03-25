from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import RoomSchema 
from models import RoomModel
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from blocklist import BLOCKLIST
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from utilities.rand import rand_string

blp = Blueprint("room", "room", description="Operations on rooms")

@blp.route("/rooms")
class Rooms(MethodView):
    @jwt_required()
    @blp.response(200, RoomSchema(many=True))
    def get(self):
        '''
        grab all room objects in greenhouse
        '''
        return RoomModel.query.all()
    
    #@jwt_required(fresh=True)
    @blp.arguments(RoomSchema)
    @blp.response(200, RoomSchema)
    def post(self, room_data):
        '''
        create new room as specified in payload
        '''
        try:

            print("Error happening here??? 1")

            public = pbkdf2_sha256.hash(rand_string(size=30)) 
            private = pbkdf2_sha256.hash(rand_string(size=60))
            print("Error happening here??? 2")


            new_room = RoomModel(
                name=room_data['name'], 
                room_key_public=public,
                room_key_private=private
            )
            print("Error 1")

            db.session.add(new_room)
            db.session.commit()
            print("Error 2")
        except IntegrityError as err:
            print(err)
            abort(400, message=f"Room already exists {err}")

        except SQLAlchemyError as err:
            print(err)
            abort(500, message=f"Internal server err: {err}")

        print("Error 3")

        return 201, 

