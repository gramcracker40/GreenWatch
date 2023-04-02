import requests, json


body = {
  "light": 8,
  "humidity": 27,
  "temperature": 89,
  "pressure": 13,
  "room_id": 1
}

req = requests.post("http://192.168.1.94:5000/rooms/1/measurement", json=body)

response = json.loads(req.text)

print(response)