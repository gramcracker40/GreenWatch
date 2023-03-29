import os

from flask import Flask, jsonify
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

from db import db
from blocklist import BLOCKLIST

from resources.greenhouse import blp as GreenhouseBlueprint
from resources.user import blp as UserBlueprint
from resources.room import blp as RoomBlueprint
from resources.experiment import blp as ExperimentBlueprint
from resources.server import blp as ServerBlueprint

# factory pattern
def create_app(db_url=None):
    app = Flask(__name__)
    CORS(app)

    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "GreenWatch REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url or os.getenv("DATABASE_URI", "sqlite:///data.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    
    migrate = Migrate(app, db)

    api = Api(app)

    app.config["JWT_SECRET_KEY"] = "127890032121005302028413019624734207168"
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

    return app



