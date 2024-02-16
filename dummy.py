#!/usr/bin/env python
import requests
import json
from time import sleep, time
import datetime
# from sense_hat import SenseHat
# from spidev import SpiDev
import random
import socket

roomID = 1
# ServerIP='192.168.0.2'
ServerIP='127.0.0.1'
duration = 23
# private_key = 'FKLVPN17IC4JPB6NPJE0MSM4ISHQRF0EQ2MNRFLEGRP3PP7HMP649SWU1PDU'
private_key = 'CP6WSHXDF4NWAJH42JLEC2WUXTF81S4Z57AGMXSYO7WREVU2MTA6RQH03QJ0'

req_headers = {
    "Key": private_key
}

server_url = f"http://{ServerIP}:5000/rooms/{roomID}/measurement"
action_url = f"http://{ServerIP}:5000/rooms/{roomID}/action"

# Actions
last_action_timestamp = ''
vent_state = 3
shade_state = 3

# States
vent_states = ['Open', 'Closed', 'Pending', 'Unknown']
shade_states = ['Open', 'Closed', 'Pending', 'Unknown']

# Time tracking (simulation)
vent_time = 0
vent_moving = False

shade_time = 0
shade_moving = False



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

def read_config(file_path = 'dummy_config.json'):
    """
    Reads .json configuration file and returns data
    """
    with open(file_path, 'r') as file:
        config_data = json.load(file)

    return config_data

def initialize_states(config_data):
    """
    Initializes states based on config
    """
    global vent_state
    global shade_state

    vent_state = config_data['states']['vent_state']
    shade_state = config_data['states']['shade_state']

    for state, value in config_data['states'].items():
        print(f'{state}: {value}')

    # Perform actions to confirm physical states
    toggle_vent(vent_state)
    toggle_shade(shade_state)

    # Post current states to update server
    post_current_states()

def post_current_states():
    """
    Posts current state data to server as fulfilled actions
    """
    global vent_state
    global shade_state

    action_json = {
        "status": 3, # completed
        "vent_state": vent_state,
        "shade_state": shade_state
        }
    print(f"\ncompleted action_json: {action_json}\n")

    post_action = requests.post(action_url, headers=req_headers, json=action_json)
    print(post_action)


def toggle_vent(state):
    """
    Toggle physical vent between open and closed
    """
    if state > 1:
        print(f"[ERROR] Invalid state {state}")
        return

    if state == 0:
        print("Opening vent...")

    elif state == 1:
        print("Closing vent...")

def toggle_shade(state):
    """
    Toggle physical vent between open and closed
    """
    if state > 1:
        print(f"[ERROR] Invalid state {state}")
        return

    if state == 0:
        print("Opening shade...")

    elif state == 1:
        print("Closing shade...")


def get_Host_name_IP():
    try:
        host_name = socket.gethostname()
        host_ip = socket.gethostbyname(host_name)
        print("Hostname :  ", host_name)
        print("IP : ", host_ip)
    except:
        print("Unable to get Hostname and IP")

    return [host_name, host_ip]


def process_actions(get_room):
            """
            Processes new actions posted to room from front-end by users
            """
            actions = get_room.json()['actions']

            global last_action_timestamp
            global vent_states
            global vent_state
            global shade_states
            global shade_state

            # Obtain last action request to room
            last_action = actions[-1]
            # print(last_action)
            if last_action is not None:
                # Check if last action was already processed by agent
                if last_action_timestamp != last_action['timestamp']:
                    last_action_timestamp = last_action['timestamp']
                    if last_action['status'] == 0:
                        print(f'[{datetime.datetime.now()}][ID:{last_action["id"]}][status:{last_action["status"]}][NEW] New action requested at {last_action_timestamp}')
                        
                        # Acknowledge action request
                        action_json = {
                                "id": last_action['id'],
                                "status": 1, # queued
                                }
                        print(f"\nacknowledge action_json: {action_json}\n")

                        patch_ack_action = requests.patch(action_url, headers=req_headers, json=action_json)
                        print(patch_ack_action)

                        # Parse and execute new action request
                        if last_action['vent_state'] != vent_state: # Vent state has changed
                            if last_action['status'] != 3: # Not moving
                                simulate_toggle("vent")

                                # Begin action request
                                action_json = {
                                "id": last_action['id'],
                                "status": 2, # in progress
                                }
                                print(f"\nin progress action_json: {action_json}\n")

                                patch_ack_action = requests.patch(action_url, headers=req_headers, json=action_json)
                                print(patch_ack_action)
                                
                        if last_action['shade_state'] != shade_state:
                            if last_action['status'] != 3: # Not moving
                                simulate_toggle("shade")

                                # Begin action request
                                action_json = {
                                "id": last_action['id'],
                                "status": 2, # in progress
                                }
                                print(f"\nin progress action_json: {action_json}\n")

                                patch_ack_action = requests.patch(action_url, headers=req_headers, json=action_json)
                                print(patch_ack_action)

                else:
                    print(f'[{datetime.datetime.now()}] Last action requested at {last_action_timestamp}')

            # Current physical states
            print(f'Vent State: {vent_states[vent_state]},\nShade State: {shade_states[shade_state]},\n')
            print("****************************\n")

def simulate_toggle(device):
     """
     Simulates toggling of physical devices e.g. vent, shade, door, etc
     such that time must elapse in the real world before these devices
     completely change state
     """

     toggle_times = {
          "vent": 8.0,
          "shade": 12.0
     }

     if device == "vent":
        global vent_time
        global vent_moving

        if not vent_moving: # start moving the vent
            vent_moving = True
            vent_time = time()
            print(f"Started timing {device}\n")
            return False # vent is not done moving
        
        else: # keep moving the vent
            time_elapsed = time() - vent_time
            print(f"time elapsed for {device}: {time_elapsed}\n")
            if time_elapsed > toggle_times[device]:
                vent_time = 0 # reset vent timer
                vent_moving = False
                print(f"[ACTION DONE] {device} took {time_elapsed} seconds to toggle\n")
                return True # vent is done moving
            else:
                return False # vent is not done moving
     
     if device =="shade":
        global shade_time
        global shade_moving

        if not shade_moving: # start moving the vent
            shade_moving = True
            shade_time = time()
            print(f"Started timing {device}\n")
            return False # shade is not done moving
        
        else: # keep moving the shade
            time_elapsed = time() - shade_time
            print(f"time elapsed for {device}: {time_elapsed}\n")
            if time_elapsed > toggle_times[device]:
                shade_time = 0 # reset shade timer
                shade_moving = False
                print(f"[ACTION DONE] {device} took {time_elapsed} seconds to toggle\n")
                return True # shade is done moving
            else:
                return False # shade is not done moving


if __name__ == "__main__":

    # Read configuration file and initialize states
    config_data = read_config()
    initialize_states(config_data)

    #initializing sensors
    # sense = SenseHat()

    # Get host name and ip address
    host_name, host_IP = get_Host_name_IP()

    while True:
        print("****************************\n")

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
        sleep(3)

        # print(post_measurement)
        
        # Get data from room
        get_room = requests.get(f'http://127.0.0.1:5000/rooms/{roomID}')
        # print(get_room)
        # print(get_room.json()['actions'])

        if vent_state < 2:
            if vent_moving:
                done = simulate_toggle("vent")
                if done:
                    vent_state = (vent_state * -1) + 1
                    post_current_states()

        if shade_state < 2:
            if shade_moving:
                done = simulate_toggle("shade")
                if done:
                    shade_state = (shade_state * -1) + 1
                    post_current_states()

        process_actions(get_room)
        