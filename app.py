# Main driver of Greenwatch application. Creates the main Flask application. All other onsite deliverables
# for the backend of an individual Greenhouse object can be found in /Backend 
#
# APPLICATION .ENV FILE
##  All environment variables can be found in .flaskenv , set the postgres connection string uri there to connect the http
# server to the database. These two seperate components are set up using the "docker-compose build" command. This command 
# goes and reads the docker-compose.yml file and determines how to setup the development environment based off of the steps
# listed in the markup.
# 
# DOCUMENTATION:
#  While the development flask server is running on your local machine or in the cloud you can find the documentation
#  for the API by going to 127.0.0.1:5000/swagger-ui, this is a well written piece of documentation that goes over exactly
#  how to make each call to the server...

# Core
import os

# External
from werkzeug.middleware.proxy_fix import ProxyFix
from flask import Flask, jsonify
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

# Internal
from db import db
from blocklist import BLOCKLIST
from resources.greenhouse import blp as GreenhouseBlueprint
from resources.user import blp as UserBlueprint
from resources.room import blp as RoomBlueprint
from resources.experiment import blp as ExperimentBlueprint
from resources.server import blp as ServerBlueprint
from resources.ui import blp as UserInterfaceBlueprint
from utilities.rand import rand_string

# Environment variables
from dotenv import dotenv_values
config = dotenv_values(".flaskenv")

production = bool(int(config["PRODUCTION"]))
db_uri = config["DBHOST"] if production else None

# Grabbing all old access tokens


# factory pattern --> .flaskenv FLASK_APP, allows for simple "flask run" 
# command when running the app locally
def app():
    app = Flask(__name__, template_folder="UserInterface")
    CORS(app)

    if production: # If deploying multiple domains with proxy servers you would need change
        app.wsgi_app = ProxyFix(
            app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
        )

    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "GreenWatch REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui" # Provides a very user friendly documentations
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = db_uri or "sqlite:///data.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    
    migrate = Migrate(app, db)

    api = Api(app)

    app.config["JWT_SECRET_KEY"] = rand_string(size=60)
    jwt = JWTManager(app)

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        return jwt_payload['jti'] in BLOCKLIST


    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({"description": "The token has been revoked", "error": "token_revoked"}), 401


    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        return jsonify({"message": "The token passed is not fresh", "error":"fresh_token_required"}), 401


    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"message": "The token has expired", "error": "token_expired"}), 401
    

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"message": "Signature verification failed.", "error": "invalid_token"}), 401


    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"message": "No valid access token in request", "error": "authorization required"}), 401

    with app.app_context():
        db.create_all()


    api.register_blueprint(UserBlueprint)
    api.register_blueprint(RoomBlueprint)
    api.register_blueprint(ExperimentBlueprint)
    api.register_blueprint(GreenhouseBlueprint)
    api.register_blueprint(ServerBlueprint)
    api.register_blueprint(UserInterfaceBlueprint)

    return app



