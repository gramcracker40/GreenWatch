import requests
req = requests.request("DELETE", "127.0.0.1:5000/user/1")

print(req.status_code)
print(req.text)