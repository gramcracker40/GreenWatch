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
    room_id = fields.Int(dump_only=True)
    name = fields.Str(unique=True)


class PlainAgentSchema(Schema):
    id = fields.Int(dump_only=True, unique=True)
    room_id = fields.Int(required=True)
    server_id = fields.Int(required=True)


class PlainExperimentSchema(Schema):
    id = fields.Int(dump_only=True, unique=True)
    room_id = fields.Int(required=True)
    name = fields.Str(required=True)


class PlainMessageSchema(Schema):
    id = fields.Int(dump_only=True, unique=True)
    room_id = fields.Int(dump_only=True)


class PlainServerSchema(Schema):
    id = fields.Int(dump_only=True, unique=True)
    name = fields.Str(required=True)


class GreenhouseSchema(Schema):
    id = fields.Int(dump_only=True, unique=True)
    name = fields.Str(required=True)
    location = fields.Str()

    rooms = fields.List(fields.Nested(PlainRoomSchema()), dump_only=True)
    servers = fields.List(fields.Nested(PlainServerSchema()), dump_only=True)


class MeasurementSchema(PlainMeasurementSchema):
    
    temperature = fields.Float(required=True)
    humidity = fields.Float(required=True)
    light = fields.Float(required=True)
    pressure = fields.Float(required=True)
    timestamp = fields.DateTime(dump_only=True)


class MessageSchema(PlainMessageSchema):
    body = fields.String(required=True)
    user_id = fields.Int(required=True)
    timestamp = fields.DateTime(dump_only=True)


class RoomSchema(PlainRoomSchema):
    experiments = fields.List(fields.Nested(PlainExperimentSchema), dump_only=True)
    measurements = fields.List(fields.Nested(MeasurementSchema()), dump_only=True)
    messages = fields.List(fields.Nested(MessageSchema()), dump_only=True)


class AgentSchema(PlainAgentSchema):
    private_key = fields.Str(required=True, load_only=True)
    duration = fields.Time(required=True)
    ip_address = fields.IPv4(required=True)


class ExperimentSchema(PlainExperimentSchema):
    
    upper_temp = fields.Float(required=True)
    lower_temp = fields.Float(required=True)

    lower_hum = fields.Float(required=True)
    upper_hum = fields.Float(required=True)

    average_light = fields.Float(dump_only=True)
    average_pressure = fields.Float(dump_only=True)
    average_temp = fields.Float(dump_only=True)
    average_humidity = fields.Float(dump_only=True)

    start = fields.DateTime(required=True)
    end = fields.DateTime(required=True)

    time_spent_outside = fields.Time(dump_only=True)
    alert_on = fields.Boolean(required=True)
    active = fields.Boolean(dump_only=True)

    users = fields.List(fields.Nested(UserRegisterSchema), dump_only=True)
    measurements = fields.List(fields.Nested(MeasurementSchema), dump_only=True)


class ExperimentUpdateSchema(Schema):
    id = fields.Int(dump_only=True, unique=True)
    
    start = fields.DateTime()
    end = fields.DateTime()

    upper_temp = fields.Float()
    lower_temp = fields.Float()

    lower_hum = fields.Float()
    upper_hum = fields.Float()

    alert_on = fields.Boolean()


class ServerSchema(PlainServerSchema):
    
    greenhouse_id = fields.Integer(required=True)
    agents = fields.List(fields.Nested(AgentSchema), dump_only=True)
    ip_address = fields.IPv4(required=True)


class DateRangeSchema(Schema):
    start_date = fields.Date(required=True, format="%Y-%m-%d")
    end_date = fields.Date(required=True, format="%Y-%m-%d")



