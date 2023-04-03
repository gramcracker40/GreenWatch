from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import ExperimentSchema, PlainExperimentSchema, ExperimentUpdateSchema
from models import ExperimentModel, UserModel, RoomModel
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from blocklist import BLOCKLIST
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from utilities.rand import rand_string
from datetime import datetime, date, time

blp = Blueprint("experiment", "experiment", description="Operations on experiments")

@blp.route("/experiments")
class Experiments(MethodView):
    #@jwt_required()
    @blp.response(200, ExperimentSchema(many=True))
    def get(self):
        '''
        grab all experiment objects in greenhouse
        '''
        return ExperimentModel.query.all()
    
    #@jwt_required(fresh=True)
    @blp.arguments(ExperimentSchema)
    @blp.response(200, PlainExperimentSchema)
    def post(self, experiment_data):
        '''
        create new experiment in greenhouse
        '''
        experiment = ExperimentModel(**experiment_data)

        experiment.time_spent_outside = time(0,0,0)
        experiment.average_light = 0.0
        experiment.average_pressure = 0.0
        experiment.average_temp = 0.0
        experiment.average_humidity = 0.0

        # start = datetime.fromisoformat(experiment_data["start"])
        # end = datetime.fromisoformat(str(experiment_data["end"])
        current = datetime.now()
        
        if experiment_data["start"] < current and current < experiment_data["end"]:
            experiment.active = True
        else:
            experiment.active = False

        room = RoomModel.query.get_or_404(experiment_data["room_id"])
        active_experiments = [experiment for experiment in room.experiments
                            if experiment.active]
        if active_experiments:
            abort(409, message="There is an experiment already going on in this room.")

        try:
            db.session.add(experiment)
            db.session.commit()
        except IntegrityError as err:
            abort(400, message=f"Experiment already exists, change name")

        except SQLAlchemyError as err:
            abort(500, message=f"Unhandled server err: --> {err}")

        return {"Success": True, "message": "experiment added successfully"}, 201
        

@blp.route("/experiments/<int:experiment_id>")
class Experiment(MethodView):
    #@jwt_required()
    @blp.response(200, ExperimentSchema)
    def get(self, experiment_id):
        '''
        grab a experiment object in greenhouse
        '''
        return ExperimentModel.query.get_or_404(experiment_id)

    @jwt_required()
    def delete(self, experiment_id):
        '''
        delete a experiment object in greenhouse
        '''

        jwt = get_jwt()
        if(jwt['admin'] == False):
            abort(403, message=f"User trying to delete experiment_id={experiment_id} is not an admin")

        print(experiment_id)
        experiment = ExperimentModel.query.get_or_404(experiment_id)

        try:
            db.session.delete(experiment)
            db.session.commit()
        except SQLAlchemyError as err:
            abort(500, message=f"Internal server error unhandled -> {err}")
            


        return {"Success": True}, 200
    

    #@jwt_required()
    @blp.arguments(ExperimentUpdateSchema)
    def patch(self, experiment_data, experiment_id):
        experiment = ExperimentModel.query.get_or_404(experiment_id)

        for key, value in experiment_data.items():
            setattr(experiment, key, value)
            
        db.session.commit()

        return {"Success": True}, 201



@blp.route("/experiments/<int:experiment_id>/users/<int:user_id>")
class ExperimentUsers(MethodView):
    
    #@jwt_required()
    def post(self, experiment_id, user_id):

        experiment = ExperimentModel.query.get_or_404(experiment_id)
        user = UserModel.query.get_or_404(user_id)

        experiment.users.append(user)

        try:
            db.session.add(experiment)
            db.session.commit()

        except SQLAlchemyError as err:
            abort(500, message=f"Internal server error unhandled -> {err}")

        return {"Success": True}, 201



def ExperimentCheck():
    '''
    runs through which experiments to activate, and which to deactivate. 
    '''
    experiments = ExperimentModel.query.all()

    curr = datetime.now()
    activate_experiments = [experiment for experiment in experiments
                          if (experiment.start < curr and curr < experiment.end 
                          and experiment.active == False)]
    
    for each in activate_experiments:
        each.active = True
        db.session.add(each)
    
    db.session.commit()

    deactivate_experiments = [experiment for experiment in experiments
                          if (experiment.start > curr or curr > experiment.end 
                          and experiment.active == True)]
    
    for _each in deactivate_experiments:
        _each.active = False
        db.session.add(_each)

    db.session.commit()
