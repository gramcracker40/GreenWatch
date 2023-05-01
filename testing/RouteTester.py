import requests
import json
import re

test_url = "http://127.0.0.1:5000"
user = "tester"
passw = "testtest"


class RouteTester:
    '''
    Implements methods used to test the Greenwatch REST API

    Testing will be done in stages, some resources we are testing creation of
    rely on other resources becoming created first. 

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
        
        try:
            fake_user_req = requests.post(register_url, json={"username": username, "password": password, 
                "first_name":"test", "last_name": "name", "is_admin": True, "email": "test@testmail.com"})
            
            self.fake_user_id = json.loads(fake_user_req.text)["user_id"]

            auth_url = base_url + "/login"
            jwt = json.loads(requests.post(auth_url, json={"username": username, "password": password}).text)

            self.headers = {"Authorization": f"Bearer {jwt['access_token']}"}

        except KeyError as err:
            print(f"Initialization of RouteTester: Error --> {err}")


    def __del__(self):
        '''
        logs out the user created in __init__ for the tests and then deletes the user as well
        '''
        logout_url = self.base_url + "/logout"
        del_url = self.base_url + f"/users/{self.fake_user_id}"
        
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
                req = requests.request(method, url, headers=self.headers, json=data)
            else:
                req = requests.request(method, url, headers=self.headers)

            if req.status_code != 200 and req.status_code != 201:
                return {"uri":uri, "method": method, "status_code": req.status_code, "error": req.text}
            
            obj = json.loads(req.text)

        except requests.exceptions.RequestException as err:
            return {"uri":uri, "method": method, "status_code": req.status_code, "error": err}

        return {"uri": uri, "method": method, "status_code": req.status_code, "data": obj}


    def test_routes(self, file:str, dump:bool=True, json_file_save:str=None) -> dict:
        '''
        file            : str  --> path to the formatted JSON file, examples below
        dump            : bool --> determines if test_routes dumps results to terminal
        json_file_save  : str  --> name of desired saved JSON file for results


        accepts the path to a specific formatted JSON file. Below will detail
        the format. test_routes should be able to be made to work
        for any JSON based REST API. 

        stage_variables --> able to parse variables needed for the individual calls by tracking all keys returned 
        by POST methods. All POST methods Greenwatch will return the id of the newly created resource

        {
            "URI-Name": ["/uri", [methods implemented], {"method": {"data": "dataaa"}}]
        }

        {
            "REGISTER" : ["/register", ["POST"], {"POST":{"username": "test", "password": "testtest", "first_name":"test", "last_name": "name", "is_admin": true, "email": "test@testmail.com"}}],
            "LOGIN" : ["/login", ["POST"], {"POST": {"username": "test", "password": "testtest"}}],
        }
        '''
        api_file = open(file, "r")
        api = json.load(api_file)

        # could change based on implemented routes needing data passed as json.
        data_methods = ("POST", "PATCH", "PUT")

        results = {}
        stage_variables = {"user_id": self.fake_user_id}
        delete_tests = []
        for resource in api:
            for method in api[resource][1]:
                uri = api[resource][0]

                if "'" in uri:
                    uri_parts = uri.split("'")

                    # determining the variables in the resources URI, then finding the matching
                    # stage variable and replacing it. 
                    id_vars = [(count,var) for count, var in enumerate(uri_parts) if "id" in var]
                    id_vals = [(id_var[0], stage_variables[id_var[1]]) for id_var in id_vars]

                    for part, value in id_vals:
                        uri_parts[part] = value

                    uri = ""
                    for each in uri_parts:
                        uri += str(each)

                # all delete methods will run at end of all tests
                if method == "DELETE":
                    delete_tests.append((resource, uri))
                    continue
     
                try:
                    # if the request needs data
                    if method in data_methods:
                        # see if the test_data needs a stage variable to be valid. if so, parse it and replace in parsed_data
                        test_data = api[resource][2][method]
                        parsed_data = {each_key: (stage_variables[each_key] if each_key in stage_variables else test_data[each_key])
                                  for each_key in test_data}
                        
                        test = RouteTester.request(self, uri, method, data=parsed_data)
                    else:
                        test = RouteTester.request(self, uri, method)

                    
                    try:
                        if method == "POST" and type(test["data"]) == dict:
                            for key in test["data"]:
                                stage_variables[key] = test["data"][key]
                    except KeyError as err:
                        pass


                    if resource in results:
                        results[resource].append(test)
                    else: 
                        results[resource] = [test]

                except KeyError as err:
                    print(err)
                    print(err.with_traceback)

                except IndexError as err:
                    print(err)
                    print(err.with_traceback)

                except requests.exceptions.RequestException as err:
                    print(err)
                    print(err.with_traceback)

        # now run all delete methods to purge database of all testing resources created.
        # run it in reverse because deleting the greenhouse object cascades to all other resources
        for each in reversed(delete_tests):  # each[1] = uri   each[0] = resource
            test = RouteTester.request(self, each[1], "DELETE")
            results[each[0]] = test

        # outputting options in params
        if dump:
            json.dumps(results, indent=2)

        if json_file_save:
            file = open(f"{json_file_save}.json", "w")
            json.dump(results, file, indent=2)

        return results


test_file_name = "routes.json"

test = RouteTester(base_url=test_url, username=user, password=passw)
test_results = test.test_routes(test_file_name, dump=True, json_file_save="test_results")

del test
#real = test.request("/login", "POST", {"username": "test", "password": "testtest"})



