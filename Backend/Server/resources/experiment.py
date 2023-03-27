from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import RoomSchema, MeasurementSchema, DateRangeSchema
from models import RoomModel, MeasurementModel
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from blocklist import BLOCKLIST
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from utilities.rand import rand_string
from datetime import datetime, date

blp = Blueprint("experiment", "experiment", description="Operations on experiments")

# @blp.route("/experiment")
# class Rooms(MethodView):
#     #@jwt_required()
#     @blp.response(200, RoomSchema(many=True))
#     def get(self):
#         '''
#         grab all room objects in greenhouse
#         '''
#         return RoomModel.query.all()
    
#     #@jwt_required(fresh=True)
#     @blp.arguments(RoomSchema)
#     @blp.response(200, RoomSchema)
#     def post(self, room_data):
#         '''
#         create new room as specified in payload
#         '''
#         try: