#!/usr/bin/env python
import requests
import json
from time import sleep
from sense_hat import SenseHat
from spidev import SpiDev

roomID = 1
ServerIP='192.168.1.23'
duration = 10
private_key = '1TWDC9G4J96OOYU78JE5AUDF068QQOHWX2W6XU2FXCMIY0RDL878OKWW06VL'

req_headers = {
    "Key": private_key
}

server_url = f"http://{ServerIP}:5000/rooms/{roomID}/measurement"

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


#initializing sensors
sense = SenseHat()
adc = MCP()


while True:
    #Temperature
    temp = round(sense.get_temperature(), 2)
    #Humidity
    hum = round(sense.get_humidity(), 2)
    #Light
    light = adc.read(channel = 0)
    #AirPressure
    pres = round(sense.get_pressure(), 2)

    #Dataset
    dataSet = {'temperature': temp,
                'humidity': hum,
                'light': light,
                'pressure': pres}


    post_measurement = requests.post(server_url, headers=req_headers, json=dataSet)

    server_data = json.loads(post_measurement.text)
    sleep(int(server_data["duration"]))

