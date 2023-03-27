from models import RoomModel


def ExperimentCheck(room_id):
    room = RoomModel.query.get_or_404(room_id)

    active_experiments = [experiment for experiment in room.experiments
                          if experiment.active]
