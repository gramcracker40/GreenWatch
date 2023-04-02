import uuid
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas import UserLoginSchema, UserRegisterSchema, UserUpdateSchema
from models import UserModel
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from db import db
from blocklist import BLOCKLIST
from sqlalchemy.exc import SQLAlchemyError, IntegrityError


blp = Blueprint("users", "users", description="Operations on users")


@blp.route("/register")
class UserRegister(MethodView):
    #@jwt_required(fresh=True)
    @blp.arguments(UserRegisterSchema)
    def post(self, user_data):
        
        if UserModel.query.filter(UserModel.username == user_data["username"]).first():
            abort(409, message="A user with that username already exists")

        user = UserModel(
            username=user_data['username'], 
            password=pbkdf2_sha256.hash(user_data['password']),
            is_admin=user_data['is_admin'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data["last_name"]
        )

        try:
            db.session.add(user)
            db.session.commit()

        except IntegrityError as err:
            abort(409, message=f"Duplicate resource identified - {err}")
        except SQLAlchemyError as err:
            abort(500, message=f"Database error occurred, error: {err}")

        return {"message": "User created successfully"}


@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(UserLoginSchema)
    def post(self, user_data):
        user = UserModel.query.filter_by(username=user_data['username']).first()

        if user and pbkdf2_sha256.verify(user_data["password"], user.password):
            access_token = create_access_token(identity=user.id, fresh=True, additional_claims={"admin": user.is_admin})
            refresh_token = create_refresh_token(identity=user.id, additional_claims={"admin": user.is_admin})
            return {"success": True, "access_token": access_token, "refresh_token": refresh_token}

        abort(401, message="Invalid credentials")


@blp.route("/logout")
class UserLogout(MethodView):
    @jwt_required()
    def post(self):
        jti = get_jwt()['jti']
        BLOCKLIST.add(jti)
        return {"message": "Successfully logged out"}, 201


@blp.route("/refresh")
class TokenRefresh(MethodView):
    #@jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user, fresh=False, additional_claims={"admin": True})

        jti = get_jwt()['jti']
        BLOCKLIST.add(jti)
        
        return {"access_token": new_token}, 201


@blp.route("/users")
class Users(MethodView):
    #@jwt_required(refresh=True)
    @blp.response(200, UserRegisterSchema(many=True))
    def get(self):
        return UserModel.query.all()
    


@blp.route("/users/<int:user_id>")
class User(MethodView):
    #@jwt_required(refresh=True)
    def delete(self, user_id):
        user = UserModel.query.get_or_404(user_id)

        try:
            db.session.delete(user)
            db.session.commit()
        except SQLAlchemyError as err:
            abort(500, message=f"Error in DB drivers --> Error code: {err}")

        return {"Success": True}, 200


    #@jwt_required(refresh=True)
    @blp.arguments(UserUpdateSchema)
    def patch(self, user_data, user_id):
        '''
        test for admin credentials
        '''
        
        user = UserModel.query.get_or_404(user_id)

        for key, value in user_data.items():
            if key != "password":
                setattr(user, key, value)

        try:
            hashed = pbkdf2_sha256.hash(user_data["password"])
            user.password = hashed
        # KeyError is thrown in case of "password" not being present in user_data
        except KeyError:
            pass

        db.session.commit()

        return {"Success": True}, 201
