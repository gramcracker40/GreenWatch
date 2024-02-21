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
import werkzeug
from pythonping import ping

blp = Blueprint("server", "server", description="Operations on servers")
dir_path = os.path.dirname(os.path.dirname(__file__))

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

    def build_agent(self, room_id, server_ip_address, passcode, duration):
        '''
        builds the agent executable
        '''
        # marking location of Agent boiler plate code
        agent_path = dir_path + "/Backend/Agent/agent.py"
        copy_path = dir_path + f"/resources/agent{room_id}.py"

        # copying boiler plate code into resources as a copy and opening the copy
        shutil.copy(agent_path, copy_path)
        copy = open(f"{dir_path}/resources/agent{room_id}.py", "r")

        # patterns to parse through the creation of the room specific agent
        patterns = {
            "'///room-id///'": room_id,
            "'///private-key///'": passcode, 
            "'///server-ip///'": server_ip_address,
            "'///duration///'": int(duration.second)
        }
        
        #parsing through each line of the boiler plate code looking for the patterns above. when found
        # it will replace with appropriate unique agent values. 
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

        # writing all lines to new file to build executable from
        new_py = open(copy_path, "w")
        new_py.writelines(replace)
        new_py.close()
        
        # only able to compile to x86 and does not produce an exe compatible with rasberry pi.
        #   need to image a seperate OS to compile executable needed
        # 
        # try:
        #     create_exe_p = subprocess.Popen(
        #         f"pyinstaller '{copy_path}' --noconfirm --onefile --windowed",
        #         shell=True,
        #         stdout=subprocess.PIPE,
        #         stderr=subprocess.PIPE
        #     )
        #     outs, errs = create_exe_p.communicate(timeout=30)
        # except subprocess.TimeoutExpired as err:
        #     create_exe_p.kill()


    #@jwt_required()
    @blp.arguments(AgentSchema())
    def post(self, agent_data):
        '''
        takes the agent data and creates a new agent for the greenhouse
        '''
        
        agent = AgentModel(**agent_data)
        room = RoomModel.query.get_or_404(agent_data['room_id'])
        server = ServerModel.query.get_or_404(agent_data['server_id'], 
                            description=f"server does not exist")

        if room.agent:
            abort(400, message=f"room already has an agent, please delete the existing agent to create a new one")

        passcode = rand_string(size=60)
        hash = pbkdf2_sha256.hash(passcode)
        agent.private_key = hash
        
        try:
            db.session.add(agent)
            db.session.commit()
        except IntegrityError as err:
            abort(400, message=f"resource with unique identifier found in request, please respecify data")
        except SQLAlchemyError as err:
            abort(500, message=f"An unhandled server error has occurred -> {err}")

        new_agent = AgentModel.query.filter(AgentModel.private_key == hash).first()

        self.build_agent(room.id, server.ip_address, passcode, agent_data["duration"])

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
        Grabs agent specific executable file. 

        The executable will run on the rasberry pi os and collect measurements from
        the senseHAT and associate those measurements with the specific room it was 
        originally created for. Boiler plate code it is copying and parsing out is located
        in Backend/Agent/agent.py
        
        example json: {"private_key": "60 character string from Post"}}
        '''
        agent = AgentModel.query.get_or_404(agent_id)
        
        build_path = dir_path + f"/resources/agent{agent.room_id}.py"

        return send_file(build_path)



    #@jwt_required(fresh=True)
    def delete(self, agent_id):
        '''
        delete an agent and all build paths associated by id
        '''
        agent = AgentModel.query.get_or_404(agent_id)
        
        paths = [f"{dir_path}/dist/agent{agent.room_id}",
                 f"{dir_path}/resources/agent{agent.room_id}.py",
                 f"{dir_path}/agent{agent.room_id}.spec"]
        
        try:
            db.session.delete(agent)
            db.session.commit()

            for path in paths:
                os.remove(path)

        except SQLAlchemyError as err:
            abort(500, message=f"Unresolved server error: --> {err}")
        except FileNotFoundError as err:
            print(f"File not found -> {err}")
            pass

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
    
@blp.route("/servers/agents/<int:agent_id>/ping")
class Agent(MethodView):

    #@jwt_required()
    def get(self, agent_id):
        '''
        Pings an agent to return its status
        
        '''
        agent = AgentModel.query.get_or_404(agent_id)
        ip = agent.ip_address # to be updated, refers to server ip but should refer to agent ip

        response = ping(ip, timeout = 0.5)
        responseStr = str(list(response)[0])

        if "Reply from" in responseStr:
            print(f"{ip} Ping Successful, Host is UP!")
            success = 1
        else:
            print(f"{ip} Ping Unsuccessful, Host is DOWN.")
            success = 0

        return {"success": success,
                "response": responseStr }, 201