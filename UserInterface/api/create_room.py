import requests, json


body = {
    "name": "room1",
    "greenhouse_id": 1
  }

req = requests.post("http://192.168.1.94:5000/rooms", json=body)

response = json.loads(req.text)

print(response)