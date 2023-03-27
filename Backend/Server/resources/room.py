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

blp = Blueprint("room", "room", description="Operations on rooms")

@blp.route("/rooms")
class Rooms(MethodView):
    #@jwt_required()
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
            public = pbkdf2_sha256.hash(rand_string(size=30)) 
            private = pbkdf2_sha256.hash(rand_string(size=60))

            new_room = RoomModel(
                name=room_data['name'], 
                room_key_public=public,
                room_key_private=private
            )

            db.session.add(new_room)
            db.session.commit()

        except IntegrityError as err:
            abort(400, message=f"Room already exists {err}")
        except SQLAlchemyError as err:
            abort(500, message=f"Internal server err: {err}")

        print("Error 3")


@blp.route("/rooms/<int:room_id>")
class Room(MethodView):

    #@jwt_required()
    @blp.response(200, RoomSchema)
    def get(self, room_id):
        return RoomModel.query.get_or_404(room_id)
    
    @jwt_required(fresh=True)
    def delete(self, room_id):
        
        jwt = get_jwt()
        if(jwt['admin'] == False):
            abort(403, message=f"User trying to delete room_id={room_id} is not an admin")
        

        room = RoomModel.query.get_or_404(room_id)

        db.session.delete(room)
        db.session.commit()

        return {"message": "room deleted successfully"}, 200



@blp.route("/rooms/<int:room_id>/measurement")
class Measurement(MethodView):
    
    @blp.arguments(MeasurementSchema)
    def post(self, measurement_data, room_id):
        room = RoomModel.query.get_or_404(room_id)

        active_experiments = [experiment for experiment in room.experiments
                            if experiment.active]

        measurement = MeasurementModel(**measurement_data)
        
        measurement.timestamp = datetime.now()
        measurement.room_id = room_id

        if active_experiments:
            active_experiments[0].measurements.append(measurement)
        
        room.measurements.append(measurement)

        try:
            db.session.add(measurement)
            db.session.commit()

        except SQLAlchemyError as err:
            abort(500, message=f"a SQLAlchemy error occurred, err: {err}")


        return {"message": "Successfully added new measurement"}, 201
    

    @blp.arguments(DateRangeSchema)
    def get(self, dates, room_id):
        room = RoomModel.query.get_or_404(room_id)

        valid = []
        for measurement in room.measurements:

            _date = date.fromisoformat(str(measurement.timestamp).split()[0])

            if _date >= dates["start_date"] and _date <= dates["end_date"]:
                valid.append({
                    "temperature": measurement.temperature,
                    "humidity": measurement.humidity,
                    "light": measurement.light,
                    "pressure": measurement.pressure, 
                    "timestamp": measurement.timestamp
                })


        return {"Success": True, "data": valid}, 200

        
        

