from flask import request, render_template, send_file, send_from_directory
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import GreenhouseSchema
from models import GreenhouseModel
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db import db
from blocklist import BLOCKLIST
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from utilities.rand import rand_string
from datetime import datetime, date, time
import os

blp = Blueprint("User-Interface", "ui", description="provides user interface files for server")

# grabbing root directory path
dir = os.path.dirname(os.path.realpath(__file__))
# root = str(os.path.split(os.path.split(os.path.split(dir)[0])[0])[0])

home_page_path = dir + "\\UserInterface\\home.html"
login_page_path = dir + "\\UserInterface\\login.html"
room_page_path = dir + "\\UserInterface\\room.html"


image_directory = dir + "\\UserInterface\\images"
css_directory = dir + "\\UserInterface\\css"
js_directory = dir + "\\UserInterface\\js"
api_directory = dir + "\\UserInterface\\api"


@blp.route("/")
class LoginPage(MethodView):
    '''
    describe the login page
    '''

    def get(self):
        
        return send_file(login_page_path)
    

@blp.route("/home")
class HomePage(MethodView):
    '''
    describe the home page 
    '''
    def get(self):
        return send_file(home_page_path)


@blp.route("/home/room/<int:room_id>")
class RoomPage(MethodView):
    '''
    describe the room page template returned
    '''
    
    def get(self, room_id):
        return send_file(room_page_path)



@blp.route("/js/<string:js_file>")
class JavaScriptFiles(MethodView):
    def get(self, js_file):
        return send_from_directory(js_directory, js_file)


@blp.route("/css/<string:css_file>")
class CSSFiles(MethodView):
    def get(self, css_file):
        return send_from_directory(css_directory, css_file)
    

@blp.route("/images/<string:image_file>")
class ImageFiles(MethodView):
    def get(self, image_file):
        return send_from_directory(image_directory, image_file)
    

@blp.route("/api/<string:api_file>")
class JSAPIFiles(MethodView):
    def get(self, api_file):
        return send_from_directory(api_directory, api_file)
