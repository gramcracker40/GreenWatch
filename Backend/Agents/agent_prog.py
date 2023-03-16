import socket
from json import dumps
from json import JSONEncoder
import math
from time import sleep
from sense_hat import SenseHat

bufferSize = 1024
roomTitle = "Empty Room"

#initializing sensors
sense = SenseHat()

#Rounding function
def round(n, decimal = 0):
    multiplier = 10 ** decimal
    return math.ceil(n * multiplier) / multiplier

#Json encoder
class set_encoder(JSONEncoder):
    def default(self, obj):
        return list(obj)

ServerPort = 2222
ServerIP='127.0.0.1'

RPIsocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
RPIsocket.bind((ServerIP, ServerPort))
print('Server is online...')

while True:
    #Temperature
    temp = round(sense.get_temperature(), 2)
    #Humidity
    hum = round(sense.get_humidity(), 2)
    #Light
    light = 1
    #AirPressure
    pres = round(sense.get_pressure(), 2)
    
    #Rounding to the nearest hundreth (0.01)
    print("Temperature: %sC" %temp)
    print("Humidity: %s%%" %hum)
    print("Air Pressure: %s Millibars" %pres)

    #Dataset
    dataSet = {temp, hum, light, pres}
    
    print(dataSet)
    
    #Encoding data set
    packToSend = jsonData = set_encoder().encode(dataSet)
    
    message,address = RPIsocket.recvfrom(bufferSize)
    message = message.decode('utf-8')
    print(message)
    print('Client Address', address[0])
    RPIsocket.sendto(packToSend, address)