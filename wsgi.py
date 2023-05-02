# +++++++++++ FLASK +++++++++++
# bind any WSGI server to this module instead of create_app()
# create_app() is good with flask run cause it handles everything for you
# when you switch to developments you must setup the WSGI server and bind
# to this module. See --> docker-compose.prod.yml

from app import app
application = app()
