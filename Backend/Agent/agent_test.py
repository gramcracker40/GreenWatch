#!/usr/bin/env python
import socket
from json import dumps
from json import JSONEncoder
import math
from time import sleep
from sense_hat import SenseHat
from spidev import SpiDev

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
    
class MCP:
    def __init__(self, bus = 0, device = 0):
        self.bus, self.device = bus, device
        self.spi = SpiDev()
        self.open()
        self.spi.max_speed_hz = 1000000
        
    def open(self):
        self.spi.open(self.bus, self.device)
        self.spi.max_speed_hz = 1000000
        
    def read(self, channel = 0):
        adc = self.spi.xfer2([1, (8 + channel) << 4, 0])
        data = ((adc[1] & 3) << 8) + adc[2]
        return data
    def close(self):
        self.spi.close()

ServerPort = 2224
ServerIP='127.0.0.1'

RPIsocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
RPIsocket.bind((ServerIP, ServerPort))
print('Server is online...')

while True:
    adc = MCP()
    #Temperature
    temp = round(sense.get_temperature(), 2)
    #Humidity
    hum = round(sense.get_humidity(), 2)
    #Light
    light = adc.read(channel = 0)
    #AirPressure
    pres = round(sense.get_pressure(), 2)

    #Dataset
    dataSet = {'Temperature': temp,
               'Humidity': hum,
               'Lighting': light,
               'AirPressure': pres}
    print(dataSet['Temperature'])
    print(dataSet['Humidity'])
    print(dataSet['Lighting'])
    print(dataSet['AirPressure'])
    
    #Encoding data set
    packToSend = jsonData = set_encoder().encode(dataSet)
    
    print(jsonData)
    
    message,address = RPIsocket.recvfrom(bufferSize)
    message = message.decode('utf-8')
    print(message)
    print('Client Address', address[0])
    RPIsocket.sendto(packToSend, address)
