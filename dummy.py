#!/usr/bin/env python
import requests
import json
from time import sleep
# from sense_hat import SenseHat
# from spidev import SpiDev
import random

roomID = 1
# ServerIP='192.168.0.2'
ServerIP='127.0.0.1'
duration = 23
# private_key = 'FKLVPN17IC4JPB6NPJE0MSM4ISHQRF0EQ2MNRFLEGRP3PP7HMP649SWU1PDU'
private_key = 'S5TAKIYL49N7C9BJCNY3VFVC67AHELUXNBCFLPCVGT9AR9HIQVOE1VU5HXCK'

req_headers = {
    "Key": private_key
}

server_url = f"http://{ServerIP}:5000/rooms/{roomID}/measurement"

# Actions
last_action_timestamp = ''
vent_state = 2
shade_state = 2

# States
vent_states = ['Open', 'Closed', 'Unknown']
shade_states = ['Open', 'Closed', 'Unknown']

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
# sense = SenseHat()p


while True:
    #Temperature
    # temp = round(sense.get_temperature(), 2)
    temp = round(random.random() * 50 + 50)

    #Humidity
    # hum = round(sense.get_humidity(), 2)
    hum = round(random.random() * 50 + 50)

    #Light
    # light = adc.read(channel = 0)
    light= round(random.random() * 50 + 50)

    #AirPressure
    # pres = round(sense.get_pressure(), 2)
    pres = round(random.random() * 50 + 50)

    #Dataset
    dataSet = {'temperature': temp,
                'humidity': hum,
                'light': light,
                'pressure': pres}
    
    # print(dataSet)


    post_measurement = requests.post(server_url, headers=req_headers, json=dataSet)

    # server_data = json.loads(post_measurement.text)
    # sleep(int(server_data["duration"]))
    sleep(5)

    # print(post_measurement)

    # Get data from room
    get_room = requests.get(f'http://127.0.0.1:5000/rooms/{roomID}')
    # print(get_room)
    # print(get_room.json()['actions'])

    actions = get_room.json()['actions']

    # Obtain last action request to room
    last_action = actions[-1]
    # print(last_action)
    if last_action is not None:
        # Check if last action was already processed by agent
        if last_action_timestamp != last_action['timestamp']:
            last_action_timestamp = last_action['timestamp']
            print(f'[NEW] New action requested at {last_action_timestamp}')

            # Parse new action request
            vent_state = last_action['vent_state']
            shade_state = last_action['shade_state']

        else:
            print(f'Last action requested at {last_action_timestamp}')


    # Current physical states
    print(f'Vent State: {vent_states[vent_state]},\nShade State: {shade_states[shade_state]},\n')
