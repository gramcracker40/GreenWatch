from flask import request, send_file
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import ServerSchema, AgentSchema, AgentUpdateSchema, ServerUpdateSchema
from models import ServerModel, AgentModel, RoomModel
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from utilities.rand import rand_string
from datetime import datetime, date, time
from time import sleep
import os
import shutil
import re
import subprocess

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
        
        except IntegrityError as err:
            abort(401, message="Resource with unique contraint 'IP Address' already exists.")

        except SQLAlchemyError as err:
            abort(500, message=f"An unhandled server error has occurred -> {err}")

        new_server = ServerModel.query.filter(ServerModel.name == server_data["name"]).first()

        return {"Success": True, "server_id": new_server.id}, 201
    

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
        hash = pbkdf2_sha256.hash(passcode)
        agent.private_key = hash

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

        new_agent = AgentModel.query.filter(AgentModel.private_key == hash).first()

        return {"Success": True, "private_key": passcode, "server_ip": server.ip_address,"room_id": room.id, "agent_id": new_agent.id}, 201
    
    #@jwt_required()
    @blp.response(200, AgentSchema(many=True))
    def get(self):
        return AgentModel.query.all()
    

@blp.route("/servers/agents/<int:agent_id>")
class Agent(MethodView):

    #@jwt_required()
    def get(self, agent_id):
        '''
        performed directly after post method for agent, takes private key
        from json passed and creates a new agent executable that is unique
        to the specific room that agent is attached to. 

        The executable will run on the rasberry pi os and collect measurements from
        the senseHAT and associate those measurements with the specific room it was 
        originally created for. Boiler plate code it is copying and parsing out is located
        in Backend/Agent/agent.py
        
        example json: {"private_key": "60 character string from Post"}}
        '''
        try:
            # Querying all objects associated with creation of agent
            agent = AgentModel.query.get_or_404(agent_id)
            room = RoomModel.query.get_or_404(agent.room_id)
            server = ServerModel.query.get_or_404(agent.server_id)
            
            # grabbing private key from JSON data
            private = request.get_json()["private_key"]

            # marking location of boiler plate code
            dir_path = os.path.dirname(os.path.realpath(__file__))
            agent_path = dir_path[:-16].replace('\\', '/') + "Agent/agent.py"

            # copying boiler plate code into resources as a copy and opening the copy
            shutil.copy(agent_path, f"resources/agent{room.id}.py")
            copy = open(f"{dir_path}\\agent{room.id}.py", "r")

            # patterns to parse through the copy and replace for the creation of the agent
            patterns = {
                "'///room-name///'": room.name,
                "'///room-id///'": room.id,
                "'///private-key///'": private, 
                "'///server-ip///'": server.ip_address,
                "'///duration///'": int(agent.duration.second)
            }
            
            replace = []
            replaced = False
            for line in copy:
                for pattern in patterns: 
                    if pattern in line and type(patterns[pattern]) == str:
                        replace.append(line.replace(pattern, f"'{patterns[pattern]}'"))
                        replaced = True
                    elif pattern in line:
                        replace.append(line.replace(pattern, str(patterns[pattern])))
                        replaced = True
                    
                if not replaced:
                    replace.append(line)
                else:
                    replaced = False
            
            copy.close()
            
            copy = open(f"{dir_path}\\agent{room.id}.py", "w")
            copy.writelines(replace)
            copy.close()

            try:
                create_exe_p = subprocess.Popen(f"pyinstaller resources/agent{room.id}.py --noconfirm --onefile")
                outs, errs = create_exe_p.communicate(timeout=30)
            except subprocess.TimeoutExpired as err:
                create_exe_p.kill()
                return abort(500, message="Could not create agent")

            build_path = dir_path[:-16].replace('\\', '/') + f"Server/dist/agent{room.id}.exe"

            return send_file(build_path)

        finally:
            delete_files = [dir_path[:-16].replace('\\', '/') + f"Server/resources/agent{room.id}.py",
                            dir_path[:-16].replace('\\', '/') + "Server/build",
                            dir_path[:-16].replace('\\', '/') + f"Server/agent{room.id}.spec"]

            for directory in delete_files:
                try:    
                    if(os.path.isfile(directory)):
                        os.remove(directory)
                    else:
                        shutil.rmtree(directory)

                except PermissionError:
                    pass


    #@jwt_required(fresh=True)
    def delete(self, agent_id):
        '''
        delete an agent by id
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