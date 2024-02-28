from marshmallow import Schema, fields

class UserLoginSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    

class UserRegisterSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, unique=True)
    password = fields.Str(required=True, load_only=True)
    is_admin = fields.Boolean(required=True)
    email = fields.Str(required=True, unique=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)


class UserUpdateSchema(Schema):
    username = fields.Str()
    password = fields.Str(load_only=True)
    is_admin = fields.Boolean()
    email = fields.Str()
    first_name = fields.Str()
    last_name = fields.Str()


class PlainRoomSchema(Schema):
    id = fields.Int(dump_only=True, unique=True)
    greenhouse_id = fields.Int(required=True)
    name = fields.Str(required=True, unique=True)


class PlainMeasurementSchema(Schema):
    room_id = fields.Int(dump_only=True)

class PlainActionSchema(Schema):
    id = fields.Int(dump_only=True, unique=True)
    room_id = fields.Int(dump_only=True)
    status = fields.Int(required=True)


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


class GreenhouseUpdateSchema(Schema):
    name = fields.Str(required=True)
    location = fields.Str()


class MeasurementSchema(PlainMeasurementSchema):
    temperature = fields.Float(required=True)
    humidity = fields.Float(required=True)
    light = fields.Float(required=True)
    pressure = fields.Float(required=True)
    timestamp = fields.DateTime(dump_only=True)

class ActionSchema(PlainActionSchema):
    ack = fields.Int()
    stop = fields.Int()
    vent_state = fields.Int(required=True)
    shade_state = fields.Int(required=True)
    reboot = fields.Int()
    timestamp = fields.DateTime(dump_only=True)

class MessageSchema(PlainMessageSchema):
    body = fields.String(required=True)
    user_id = fields.Int(required=True)
    timestamp = fields.DateTime(dump_only=True)


class MessageUpdateSchema(Schema):
    body = fields.String(required=True)

class RoomUpdateSchema(Schema):
    name = fields.Str()

class ActionUpdateSchema(Schema):
    id = fields.Int(required=True)
    status = fields.Int()

class RoomSchema(PlainRoomSchema):
    experiments = fields.List(fields.Nested(PlainExperimentSchema), dump_only=True)
    measurements = fields.List(fields.Nested(MeasurementSchema()), dump_only=True)
    messages = fields.List(fields.Nested(MessageSchema()), dump_only=True)
    actions = fields.List(fields.Nested(ActionSchema()), dump_only=True)

class AgentSchema(PlainAgentSchema):
    duration = fields.Time(required=True)
    ip_address = fields.String(required=True)
    status = fields.Int(required=True)
    device_ip_address = fields.String()


class AgentUpdateSchema(Schema):
    duration = fields.Time()
    ip_address = fields.String()
    status = fields.Int()
    device_ip_address = fields.String()

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

    name = fields.String()
    
    start = fields.DateTime()
    end = fields.DateTime()

    upper_temp = fields.Float()
    lower_temp = fields.Float()

    name = fields.String()

    lower_hum = fields.Float()
    upper_hum = fields.Float()

    alert_on = fields.Boolean()


class ServerSchema(PlainServerSchema):
    
    greenhouse_id = fields.Integer(required=True)
    agents = fields.List(fields.Nested(AgentSchema), dump_only=True)
    ip_address = fields.String(required=True)


class ServerUpdateSchema(Schema):
    name = fields.Str()
    ip_address = fields.Str()


class DateRangeSchema(Schema):
    start_date = fields.Date(required=True, format="%Y-%m-%d")
    end_date = fields.Date(required=True, format="%Y-%m-%d")



