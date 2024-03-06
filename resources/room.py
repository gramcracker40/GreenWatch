from flask import request, send_file, jsonify
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import RoomSchema, RoomUpdateSchema, MeasurementSchema, DateRangeSchema, MessageSchema, MessageUpdateSchema, ActionSchema, ActionUpdateSchema
from models import RoomModel, MeasurementModel, MessageModel, UserModel, AgentModel, ActionModel
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from utilities.rand import rand_string
from resources.experiment import ExperimentCheck
from datetime import datetime, date
import csv
import json
import os


blp = Blueprint("room", "room", description="Operations on rooms")
dir_path = os.path.dirname(os.path.dirname(__file__))


def admin_check(jwt_obj):
    print(jwt_obj)

@blp.route("/rooms")
class Rooms(MethodView):
    @jwt_required()
    @blp.response(200, RoomSchema(many=True))
    def get(self):
        '''
        Get all Rooms
        '''
        #admin_check(get_jwt())
        return RoomModel.query.all()
    
    @jwt_required(fresh=True)
    @blp.arguments(RoomSchema)
    def post(self, room_data):
        '''
        Create new Room
        '''
        try:
            # public = pbkdf2_sha256.hash(rand_string(size=30)) 
            # private = pbkdf2_sha256.hash(rand_string(size=60))

            new_room = RoomModel(**room_data)

            db.session.add(new_room)
            db.session.commit()

        except IntegrityError as err:
            abort(400, message=f"Room already exists")
        except SQLAlchemyError as err:
            abort(500, message=f"Internal server err --> {err}")
        
        new_room = RoomModel.query.filter(RoomModel.name == room_data["name"]).first()

        return {"Success": True, "room_id" : new_room.id}


@blp.route("/rooms/<int:room_id>")
class Room(MethodView):

    # @jwt_required()
    @blp.response(200, RoomSchema)
    def get(self, room_id):
        '''
        Get all Rooms
        '''
        return RoomModel.query.get_or_404(room_id)
    
    @jwt_required()
    @blp.arguments(RoomUpdateSchema)
    def patch(self, room_data, room_id):
        '''
        Update a Room
        '''
        room = RoomModel.query.get_or_404(room_id)

        if not room_data:
            abort(400, message="No data was provided")

        for key, value in room_data.items():
            setattr(room, key, value)

        db.session.commit()

        return {"Success": True}, 201
    
    @jwt_required(fresh=True)
    def delete(self, room_id):
        '''
        Delete a Room -- admin user required and JWT must be fresh
        '''
        
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
        '''
        Add a Measurement to a Room and any Experiments that are active
        within the room - Only agents created in the dashboard can add
        measurements to the room they were created for originally. 
        Anything else will be rejected.
        '''
        room = RoomModel.query.get_or_404(room_id)
        agent = AgentModel.query.filter(AgentModel.room_id == room.id).first()

        if agent is None:
            abort(404, message="Agent not found for room", error="agent_does_not_exist", fix=f"add an agent to {room.name}")


        key = request.headers.get("Key")
        same = pbkdf2_sha256.verify(key, agent.private_key)
        # print(f"Same Agent Private Key: {same}, Agent Key: {agent.private_key}, Request Key: {pbkdf2_sha256.encrypt(key)}")
        print(f"Same Agent Private Key: {same}")

        if same:

            ExperimentCheck()

            measurement = MeasurementModel(**measurement_data)
            measurement.timestamp = datetime.now()
            measurement.room_id = room_id

            active_experiments = [experiment for experiment in room.experiments
                                if experiment.active]

            if active_experiments:
                active_experiments[0].measurements.append(measurement)
            
            room.measurements.append(measurement)

            try:
                db.session.add(measurement)
                db.session.commit()

            except SQLAlchemyError as err:
                abort(500, message=f"a SQLAlchemy error occurred, err: {err}")


            return {"message": f"Successfully added new measurement to room ID {room_id}", "duration": agent.duration.second}, 201
        
        else:
            return {"message": f"Invalid Private Key, measurement not added to room ID {room_id}", "duration": None}, 401
    
    @blp.response(201, MeasurementSchema(many=True))
    def get(self, room_id):
        '''
        Get all Measurements in Room
        '''
        return MeasurementModel.query.filter_by(room_id=room_id).all()
    
    @jwt_required()
    @blp.arguments(DateRangeSchema)
    def put(self, dates, room_id):
        '''
        Given a start and end date, this method will return all 
        Measurements within a Room in that given period. 
        '''
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
        
        return {"Success": True, "data": valid}, 201
    
@blp.route("/rooms/<int:room_id>/measurement/csv")
class Measurement(MethodView):

    def build_csv(self, room_id, json_obj):
        """
        builds .csv file from .json measurements object
        """

        data = json_obj  # Assumes the JSON data is an array of objects
        startDate = data[0].timestamp.date()
        endDate = data[-1].timestamp.date()

        csv_file_path = dir_path + f"/resources/{startDate}_{endDate}_room{room_id}.csv"  

        # Open the CSV file for writing
        with open(csv_file_path, 'w', newline='') as csv_file:
            # If the objects in your JSON array are dictionaries with the same keys,
            # you can use the keys from the first object as the header row in the CSV
            if data:
                data_array = []
                fieldnames = ["timestamp",
                              "temperature",
                              "humidity",
                              "light",
                              "pressure" 
                    ]  # Extracting field names (column names)
                for row in data:
                    data_array.append(
                        {
                            "timestamp": row.timestamp,
                            "temperature": row.temperature,
                            "humidity": row.humidity,
                            "light": row.light,
                            "pressure": row.pressure 
                        }
                    )
                
                writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

                writer.writeheader()  # Write the column names
                for row in data_array:
                    writer.writerow(row)  # Write each row
            else:
                print("The JSON file is empty or not formatted as expected.")

        print(f"JSON data  has been converted to CSV and saved as '{csv_file_path}'")
        
        return csv_file_path
    
    # @jwt_required()
    @blp.response(201, MeasurementSchema(many=True))
    def get(self, room_id):
        '''
        Get all Measurements in Room and write to .csv file
        '''
        json_obj = MeasurementModel.query.filter_by(room_id=room_id).all()
        csv_file_path = self.build_csv(room_id, json_obj)
        return send_file(csv_file_path)
    
    
@blp.route("/rooms/<int:room_id>/action")
class Action(MethodView):
    
    @blp.arguments(ActionSchema)
    def post(self, action_data, room_id):
        '''
        Take an action in a room - Only agents created in the dashboard can 
        take actions in the room they were created for originally. 
        Anything else will be rejected.
        '''
        room = RoomModel.query.get_or_404(room_id)
        agent = AgentModel.query.filter(AgentModel.room_id == room.id).first()

        if agent is None:
            abort(404, message="Agent not found for room", error="agent_does_not_exist", fix=f"add an agent to {room.name}")

        key = request.headers.get("Key")
        token = request.headers.get("Authorization")

        if key is not None:
            valid = pbkdf2_sha256.verify(key, agent.private_key)
            # print(f"Same Agent Private Key: {same}, Agent Key: {agent.private_key}, Request Key: {pbkdf2_sha256.encrypt(key)}")
            print(f"Same Agent Private Key: {valid}")
        elif token is not None:
            # jwt = get_jwt()
            # admin_check(jwt)
            # if(jwt['admin'] == False):
            #     abort(403, message=f"User trying to add action to Room ID {room_id} is not an admin")
            # else:
                valid = True

        if valid:
            ExperimentCheck()
            
            action = ActionModel(**action_data)
            action.timestamp = datetime.now()
            action.room_id = room_id
            action.status = action_data['status']
            
            room.actions.append(action)

            try:
                db.session.add(action)
                db.session.commit()

            except SQLAlchemyError as err:
                abort(500, message=f"a SQLAlchemy error occurred, err: {err}")

            return {"message": f"Successfully added new action to room ID {room_id} - ", "duration": agent.duration.second}, 201
        
        else:
            return {"message": f"Invalid Credentials, action not added to room ID {room_id}", "duration": None}, 401
    

    # @jwt_required()
    @blp.arguments(ActionUpdateSchema)
    def patch(self, action_data, room_id):
        '''
        Update an Action
        '''
        action = ActionModel.query.get_or_404(action_data['id'])

        if not action_data:
            abort(400, message="No data was provided")

        for key, value in action_data.items():
            setattr(action, key, value)

        db.session.commit()

        return {"Success": True}, 201
    #     return {"Success": True, "data": valid}, 200

@blp.route("/rooms/messages")
class Messages(MethodView):
    @jwt_required()
    @blp.response(200, MessageSchema(many=True))
    def get(self):
        '''
        Get all Messages
        '''
        return MessageModel.query.all()


@blp.route("/rooms/<int:room_id>/messages")
class Message(MethodView):
    '''
    Used to work with messages in the seperate rooms. 
    Allows notes to be made about experiment progress. 
    '''
    @jwt_required()
    @blp.arguments(MessageSchema)
    def post(self, message_data, room_id):
        '''
        Create a new message, adds the message to the room messages
        and also the users messages. Which will be tracked in the database
        for both resources
        '''

        room = RoomModel.query.get_or_404(room_id)
        user = UserModel.query.get_or_404(message_data["user_id"])

        message = MessageModel(**message_data)
        message.timestamp = datetime.now()

        room.messages.append(message)
        user.messages.append(message)

        try:
            db.session.add(message)
            db.session.commit()

        except IntegrityError as err:
            abort(401, message="A room with that name already exists")

        except SQLAlchemyError as err:
            abort(500, message=f"a SQLAlchemy error occurred, err: {err}")

        new_message = MessageModel.query.filter(MessageModel.body == message_data["body"]).first()

        return {"Success":True, "message_id": new_message.id}, 201
    
    @jwt_required()
    @blp.response(201, MessageSchema(many=True))
    def get(self, room_id):
        '''
        Get all Messages in Room
        '''
        return MessageModel.query.filter_by(room_id=room_id).all()
    

@blp.route("/rooms/messages/<int:message_id>")
class SpecificMessage(MethodView):
    @jwt_required()
    def delete(self, message_id):
        '''
        Delete a Message
        '''
        message = MessageModel.query.get_or_404(message_id)

        db.session.delete(message)
        db.session.commit()

        return {"Success": True}, 200
    
    @jwt_required()
    @blp.arguments(MessageUpdateSchema)
    def patch(self, message_data, message_id):
        '''
        Update a Message
        '''
        message = MessageModel.query.get_or_404(message_id)

        for key, value in message_data.items():
            setattr(message, key, value)

        db.session.commit()

        return {"Success": True}, 201