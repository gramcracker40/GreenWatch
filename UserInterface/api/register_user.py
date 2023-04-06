import requests, json


body = {
    "username": "test1", 
    "password":"password1",
    "last_name": "The Hero",
    "first_name": "Billy",
    "email": "bHero@at.com",
    "is_admin": True
  }

req = requests.post("http://192.168.1.28:5000/register", json=body)

response = json.loads(req.text)

print(response)