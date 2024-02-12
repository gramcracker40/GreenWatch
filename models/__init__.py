from models.user import UserModel
from models.room import RoomModel
from models.measurement import MeasurementModel
from models.message import MessageModel
from models.experiment import ExperimentModel
from models.experiment_users import ExperimentUsersModel
from models.agent import AgentModel
from models.greenhouse import GreenhouseModel
from models.server import ServerModel
from models.action import ActionModel

# All SQL database tables created are listed above as the extension of models.table

# Models are the objects that create and control the database tables using SQLAlchemy
# These models are very flexible, providing a great number of built in queries for you
# to choose from. Learning it is not too hard, ask ChatGPT about SQLAlchemy and you will
# have plenty to look at. 

# experiment_users --> secondary model used to hold the many to many relationship between experiment and users
