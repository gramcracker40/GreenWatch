# Mini flask app that is going to be running on-site for individual greenhouses. 
# Handles transferring the measurements from the LAN at MSU. Will produce a small 
# Dockerfile to produce an nginx server with gunicorn reverse proxying the requests coming
# from the agents. 
# With this, we only need wifi to one device, the rasberry pi 4 that we have. It will be able to
# connect to wifi and relay requests to the GreenWatch home server. Wherever that may be.  


from flask import Flask, jsonify, request
from flask_smorest import Api

domain_url = "https://greenwatch.azurewebsites.net"

def create_app(test_config=None):
    
    app = Flask(__name__)

    @app.route("/measurement", methods=["POST"])
    def measurement():
        req = request.get_json()
        return {"message": req["message"]}, 201


    return app