from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import GreenhouseSchema, GreenhouseUpdateSchema
from models import GreenhouseModel
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from utilities.rand import rand_string
from datetime import datetime, date, time

blp = Blueprint("Greenhouse", "Greenhouse", description="Operations on Greenhouses")

@blp.route("/greenhouses/<int:greenhouse_id>")
class Greenhouse(MethodView):
    
    #@jwt_required()
    @blp.response(200, GreenhouseSchema())
    def get(self, greenhouse_id):
        '''
        Get a single Greenhouse by id
        '''
        return GreenhouseModel.query.get_or_404(greenhouse_id)
    
    #@jwt_required()
    @blp.arguments(GreenhouseUpdateSchema)
    def patch(self, greenhouse_data, greenhouse_id):
        '''
        Updates a current Greenhouse by id
        '''
        greenhouse = GreenhouseModel.query.get_or_404(greenhouse_id)

        try:
            for key, value in greenhouse_data.items():
                setattr(greenhouse, key, value)

        except IntegrityError as err:
            return abort(401, message="Another greenhouse has the same name")

        db.session.commit()

        return {"Success": True}, 201
    

    #@jwt_required()
    def delete(self, greenhouse_id):
        '''
        Deletes a Greenhouse given an id
        '''
        greenhouse = GreenhouseModel.query.get_or_404(greenhouse_id)

        db.session.delete(greenhouse)
        db.session.commit()

        return {"Success": True}, 201
    
@blp.route("/greenhouses")
class Greenhouses(MethodView):
    #@jwt_required()
    @blp.arguments(GreenhouseSchema())
    def post(self, greenhouse_data):
        '''
        Creates a new Greenhouse
        '''

        greenhouse = GreenhouseModel(**greenhouse_data)

        try:
            db.session.add(greenhouse)
            db.session.commit()

        except IntegrityError as err:
            abort(400, message="resource already exists, a unique key already exists in data passed. ")

        except SQLAlchemyError as err:
            abort(500, message=f"An unhandled server error has occurred -> {err}")

        new_greenhouse = GreenhouseModel.query.filter(GreenhouseModel.name == greenhouse_data["name"]).first()

        return {"Success": True, "greenhouse_id": new_greenhouse.id}, 201
    
    
    #@jwt_required()
    @blp.response(200, GreenhouseSchema(many=True))
    def get(self):
        '''
        Gets all Greenhouses
        '''
        return GreenhouseModel.query.all()