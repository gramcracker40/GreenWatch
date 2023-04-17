from flask import request, send_file
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import ServerSchema, AgentSchema, AgentUpdateSchema, ServerUpdateSchema
from models import ServerModel, AgentModel, RoomModel
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from blocklist import BLOCKLIST
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from utilities.rand import rand_string
from datetime import datetime, date, time
import os
import shutil
import re

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
    

    #@jwt_required()
    @blp.response(200, ServerSchema(many=True))
    def get(self):
        return ServerModel.query.all()


@blp.route("/servers/<int:server_id>")
class Server(MethodView):
    #@jwt_required()
    def delete(self, server_id):
        server = ServerModel.query.get_or_404(server_id)

        try:
            db.session.delete(server)
            db.session.commit()
        except SQLAlchemyError as err:
            abort(500, message=f"Unhandled server error has occurred --> {err}")

        return {"Success": True}, 200
    
    #@jwt_required()
    @blp.arguments(ServerUpdateSchema())
    def patch(self, server_data, server_id):
        '''
        update a server, can only update name and ip_address
        '''
        server = ServerModel.query.get_or_404(server_id)

        for key, value in server_data.items():
            setattr(server, key, value)

        db.session.commit()

        return {"Success": True}, 201


@blp.route("/servers/agents")
class Agents(MethodView):
    #@jwt_required()
    @blp.arguments(AgentSchema())
    def post(self, agent_data):
        '''
        takes the agent data and creates a new agent for the greenhouse
        '''

        agent = AgentModel(**agent_data)

        passcode = rand_string(size=60)
        agent.private_key = pbkdf2_sha256.hash(passcode)

        room = RoomModel.query.get_or_404(agent_data['room_id'])
        if room.agent:
            abort(400, message=f"room already has an agent, please delete the existing agent to create a new one")

        server = ServerModel.query.get_or_404(agent_data['server_id'], 
                            description=f"server does not exist")
        
        try:
            db.session.add(agent)
            db.session.commit()
        except IntegrityError as err:
            abort(400, message=f"resource with unique identifier found in request, please respecify data")
        except SQLAlchemyError as err:
            abort(500, message=f"An unhandled server error has occurred -> {err}")

        return {"Success": True, "private_key": passcode, "server_ip": server.ip_address,"room_id": room.id}, 201
    
    #@jwt_required()
    @blp.response(200, AgentSchema(many=True))
    def get(self):
        return AgentModel.query.all()
    

@blp.route("/servers/agents/<int:agent_id>")
class Agent(MethodView):

    #@jwt_required()
    def get(self, agent_id):
        '''
        TODO: Not done implementing. Need way to overwrite python file contents...

        get the executable file for a specific agent, must be chained with 
        creation of agent to receive the executable that is correct for the 
        private key that is created
        '''
        agent = AgentModel.query.get_or_404(agent_id)
        room = RoomModel.query.get_or_404(agent.room_id)
        server = ServerModel.query.get_or_404(agent.server_id)

        dir_path = os.path.dirname(os.path.realpath(__file__))
        agent_path = dir_path[:-16].replace('\\', '/') + "Agent/agent_prog.py"

        shutil.copy(agent_path, dir_path)
        copy = open(f"{dir_path}/agent_{room.id}.py", "w")

        private = request.get_json()["private_key"]

        patterns = {
            "'///room-name///'": room.name,
            "'///room-id///'": room.id,
            "'///private-key///'": private, 
            "'///server-ip///'": server.ip_address,
            "''///duration///'": str(agent.duration.second)
        }
        
        for line in copy:
            for pattern in patterns:
                if pattern in line:
                    line.replace(pattern, patterns[pattern], end='') 
    


        return send_file(copy), 200



    #@jwt_required(fresh=True)
    def delete(self, agent_id):
        '''
        takes the agent data and creates a new agent for the greenhouse
        '''

        agent = AgentModel.query.get_or_404(agent_id)

        try:
            db.session.delete(agent)
            db.session.commit()
        except SQLAlchemyError as err:
            abort(500, message=f"Unresolved server error: --> {err}")


        return {"Success":True}, 200

    @blp.arguments(AgentUpdateSchema())
    def patch(self, agent_data, agent_id):
        '''
        update an agent, can only update ip_address and duration
        '''
        agent = AgentModel.query.get_or_404(agent_id)

        for key, value in agent_data.items():
            setattr(agent, key, value)

        db.session.commit()

        return {"Success": True}, 201