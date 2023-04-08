import requests
import json
from enum import Enum
from db import db

base_url = "http://127.0.0.1:5000"
username = "test1"
password = "test1"


class RouteTester(Enum):
    '''
    Implements methods used to test the Greenwatch REST API

    __init__    --> pass the 'base_url' aka "IP:port"
                 as well as passing the username and password. 
                 can be fed in automatically at start of app

    request     --> used as a helper method for test_routes, able to be 
                given the data and intelligently form the requests
                necessary and provide the data needed for any errors
                to test_routes
    
    test_routes --> opens the formatted JSON file and tests
                all routes and places their results in a dictionary. 
                A choice between dumping results to output on startup 
                or to a JSON file is given. 

    
    '''

    def __init__(self, base_url, JWT):
        self.base_url = base_url
        self.headers = {"Authentication": f"Bearer {JWT}"}


    def request(self, uri, method, data=None):
        '''
        str:  uri="/login"
        str:  method="POST",
        dict: data={"username": "test", "password": "testtest"}
        
        pass the uri and a method as well as test data if the method is a PATCH or POST. 
        test_routes has built in logic to handle passing the data if required. 
        GET, DELETE methods will simply be ran after any POST, PATCH methods to check on 
        proper updates to created assets as well as deleting the test assets afterwards so 
        we can run this suite of tests everytime the server begins. 
        '''
        url = self.base_url + uri
        try:    
            if data:
                req = requests.request(method, url, headers=self.headers, data=data)
            else:
                req = requests.request(method, url, headers=self.headers)

            if req.status_code != 200 or req.status_code != 201:
                return {"uri":uri, "method": method, "status_code": req.status_code, "error": req.text}
            
            obj = json.loads(req.text)

        except requests.exceptions.RequestException as err:
            return {"uri":uri, "method": method, "status_code": req.status_code, "error": err}

        return obj


    def test_routes(self, file, dump=True, json_file_save=None):
        '''
        file            : str  -->
        dump            : bool -->
        json_file_save  : str  -->


        accepts the path to a specific formatted JSON file. Below will detail
        the format. test_routes should be able to be made to work
        for any JSON based REST API. 

        {
            "URI-Name": ["/uri", [methods implemented], {"data": "if any for the routes implemented"}]
        }

        {
            "REGISTER" : ["/register", ["POST"], [{"method":"POST", "username": "test", "password": "testtest"}]],
            "SPECIFICMESSAGE": ["/rooms/messages/<int:message_id>", ["DELETE", "PATCH"], {"PATCH": {"body":"a test message"}}]
        }
        '''
        pass



    
    


test = RouteTester(base_url, username, password)

real = test.request("/rooms", "GET")

print(real)