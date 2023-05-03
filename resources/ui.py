from flask import render_template, send_file, send_from_directory
from flask.views import MethodView
from flask_smorest import Blueprint
import os
from dotenv import dotenv_values

blp = Blueprint("User-Interface", "ui", 
    description="provides user interface files for server")

# grabbing root directory path
dir = os.path.dirname(os.path.realpath(__file__))
root = str(os.path.split(dir)[0])

# grabbing runtime environment variables
flask_env_path = root + "/.flaskenv"
config = dotenv_values(flask_env_path)

home_page_path = root + "/UserInterface/home.html"
login_page_path = root + "\\UserInterface\\login.html"
room_page_path = root + "/UserInterface/roompage.html"
image_directory = root + "/UserInterface/images"
css_directory = root + "/UserInterface/css"
js_directory = root + "/UserInterface/js"
api_directory = root + "/UserInterface/api"

@blp.route("/")
class LoginPage(MethodView):
    '''
    describe the login page
    '''
    def get(self):
        return render_template("login.html", server_ip=config['SERVER_IP'])
    

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
