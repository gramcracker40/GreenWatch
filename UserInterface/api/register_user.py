import requests, json


body = {
    "username": "user1", 
    "password":"Password_1",
    "last_name": "1",
    "first_name": "",
    "email": "bHero@at.com",
    "is_admin": True
  }

req = requests.post("http://192.168.1.28:5000/register", json=body)

response = json.loads(req.text)

print(response)