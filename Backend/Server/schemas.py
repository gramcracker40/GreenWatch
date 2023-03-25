from marshmallow import Schema, fields


class UserLoginSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    

class UserRegisterSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    is_admin = fields.Boolean(required=True)
    email = fields.Str(required=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)


class PlainRoomSchema(Schema):
    id = fields.Int(dump_only=True, unique=True)
    name = fields.Str(required=True, unique=True)


class PlainMeasurementSchema(Schema):
    room_id = fields.Int(dump_only=True, unique=True)
    name = fields.Str(unique=True)


class PlainAgentSchema(Schema):
    room_id = fields.Int(dump_only=True, unique=True)
    name = fields.Str(unique=True)



class RoomSchema(PlainRoomSchema):
    measurements = fields.List(fields.Nested(PlainMeasurementSchema()), dump_only=True)
    

class MeasurementSchema(PlainMeasurementSchema):
    
    temperature = fields.Float(required=True)
    humidity = fields.Float(required=True)
    light = fields.Float(required=True)
    pressure = fields.Float(required=True)
    timestamp = fields.DateTime(required=True)
    room = fields.Nested(PlainRoomSchema(), load_only=True)


class AgentSchema(PlainAgentSchema):
    room = fields.Nested(RoomSchema())

    public_key = fields.Str(required=True)
