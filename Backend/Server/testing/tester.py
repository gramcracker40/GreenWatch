import requests
import json
from enum import Enum

test_url = "http://127.0.0.1:5000"
user = "tester"
passw = "testtest"


class RouteTester:
    '''
    Implements methods used to test the Greenwatch REST API

    init    --> pass the 'base_url' aka "IP:port"
                 as well as passing the username and password. 
                 can be fed in automatically at start of app

    request     --> used as a helper method for test_routes, able to be 
                given the data and intelligently form the requests
                necessary and provide the data needed for any errors
                to test_routes

    test_routes --> Implements its own JSON format to receive consistent
                info for each route. opens the formatted JSON file and tests
                all routes and places their results in a dictionary. 
                A choice between dumping results to output on startup 
                or to a JSON file is given. 

    '''

    def __init__(self, base_url="127.0.0.1:5000", username="test", password="testtest"):
        '''
        initializes the test user and logs in receiving the JWT to pass around with the headers
        '''
        self.base_url = base_url
        self.username = username
        self.password = password

        #registering and logging in a fake user with admin credentials to test all routes with
        register_url = base_url + "/register"
        new_user_req = requests.post(register_url, json={"username": username, "password": password, 
            "first_name":"test", "last_name": "name", "is_admin": True, "email": "test@testmail.com"})
        new_user = json.loads(new_user_req.text)
        self.new_user_id = new_user["user_id"]

        auth_url = base_url + "/login"
        jwt = json.loads(requests.post(auth_url, json={"username": username, "password": password}).text)

        self.headers = {"Authorization": f"Bearer {jwt['access_token']}"}


    def __del__(self):
        '''
        logs out the user created in __init__ for the tests and then deletes the user as well
        '''
        logout_url = self.base_url + "/logout"
        del_url = self.base_url + f"/users/{self.new_user_id}"
        
        logout = requests.post(logout_url, headers=self.headers)
        delete = requests.delete(del_url, headers=self.headers)

        print(f"{logout.text}\n\n{delete.text}")
        

    def request(self, uri:str, method:str, data:dict=None) -> dict:
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

            if req.status_code != 200 and req.status_code != 201:
                return {"uri":uri, "method": method, "status_code": req.status_code, "error": req.text}
            
            obj = json.loads(req.text)

        except requests.exceptions.RequestException as err:
            return {"uri":uri, "method": method, "status_code": req.status_code, "error": err}

        return {"uri": uri, "method": method, "status_code": req.status_code, "data": obj}


    def test_routes(self, file:str, dump:bool=True, json_file_save:str=None):
        '''
        file            : str  --> path to the formatted JSON file, examples below
        dump            : bool --> determines if test_routes dumps results to terminal
        json_file_save  : str  --> name of desired saved JSON file for results


        accepts the path to a specific formatted JSON file. Below will detail
        the format. test_routes should be able to be made to work
        for any JSON based REST API. 

        {
            "URI-Name": ["/uri", [methods implemented], {"method": {"data": "dataaa"}}]
        }

        {
            "REGISTER" : ["/register", ["POST"], {"POST":{"username": "test", "password": "testtest", "first_name":"test", "last_name": "name", "is_admin": true, "email": "test@testmail.com"}}],
            "LOGIN" : ["/login", ["POST"], {"POST": {"username": "test", "password": "testtest"}}],
        }
        '''
        api_file = open("routes.json", "r")
        api = json.loads(api_file)

        results = {}
        for resource in api:
            for method in api[resource][1]:
                if method == "POST" or method == "PATCH":
                    test = RouteTester.request(self, api[resource][0], method, data=api[resource][2][method])
                else:
                    test = RouteTester.request(self, api[resource][0], method)

                try: 
                    results[resource].append(test)
                except KeyError:
                    results[resource] = [test]

        if dump:
            json.dumps(results, indent=2)

        if json_file_save:
            file = open(f"{json_file_save}.json", "w")
            json.dump(results, file)



test = RouteTester(base_url=test_url, username=user, password=passw)

real = test.request("/login", "POST", {"username": "test", "password": "testtest"})

print(real)


del test