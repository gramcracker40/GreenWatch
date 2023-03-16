from marshmallow import Schema, fields


class id_name(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)


# Building the User schemas. Admins create other users. 
# If logged in JWT generated does not have admin rights, do not create user
# load_only ---> does not return the user password in any user requests
class UserLoginSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    

class UserRegisterSchema(UserLoginSchema):
    is_admin = fields.Boolean(required=True)
    email = fields.Str(required=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)


class Greenhouse(id_name):
    

class Room(id_name):



class Experiment(id_name):



class Agent(id_name):



class Server(id_name):
    
