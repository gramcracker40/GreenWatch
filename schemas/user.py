from marshmallow import Schema, fields

class UserLoginSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    

class UserRegisterSchema(UserLoginSchema):
    is_admin = fields.Boolean(required=True)
    email = fields.Str(required=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)