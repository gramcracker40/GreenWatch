#!/usr/bin/env python
import requests
import json
from time import sleep, time
import datetime
# from sense_hat import SenseHat
# from spidev import SpiDev
import random
import socket
import subprocess
import math

roomID = 1
# ServerIP='138.197.101.211'
ServerIP='127.0.0.1'
server_data = None
duration = 3
start_time = time()
# private_key = 'FKLVPN17IC4JPB6NPJE0MSM4ISHQRF0EQ2MNRFLEGRP3PP7HMP649SWU1PDU'
private_key = 'CMILUWXJMFOXU6NZA3CT2P25A48NASR8WPOC7T2B8INR0H0LQSKWQ3EAJYTF'

req_headers = {
    "Key": private_key
}

server_url = f"http://{ServerIP}:5000/rooms/{roomID}/measurement"
action_url = f"http://{ServerIP}:5000/rooms/{roomID}/action"
agent_url = f"http://{ServerIP}:5000/servers/agents/{roomID}"

# Actions.
last_action_timestamp = ''
vent_state = 3
shade_state = 3
reboot = 0
stop = 0
ack = 0

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

# Function to reboot the Raspberry Pi
def reboot_pi():
    """
    Invokes reboot of Raspberry Pi
    """
    try:
        print("[REBOOT] Rebooting Raspberry Pi...")
        subprocess.run(['sudo', 'reboot'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Failed to reboot: {e}")

def simulate_reboot_pi(delay=5):
    """
    Simulates reboot of Raspberry Pi
    """
    global reboot
    if reboot:
        print("[SYSTEM] Initiating reboot of system...\n")
        sleep(delay)
        print(f"[SYSTEM] System rebooted in {delay} seconds \n")
        reboot = 0
    else:
        print("Reboot already in progres...")
    
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
    global stop
    global vent_state
    global shade_state

    global duration
    
    stop = config_data['states']['stop']
    vent_state = config_data['states']['vent_state']
    shade_state = config_data['states']['shade_state']

    duration = config_data['settings']['duration']

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
    global stop
    global vent_state
    global shade_state
    global reboot

    action_json = {
        "ack": ack,
        "status": 3, # completed
        "stop": stop,
        "vent_state": vent_state,
        "shade_state": shade_state,
        "reboot": reboot
        }
    print(f"\ncompleted action_json: {action_json}\n")

    post_action = requests.post(action_url, headers=req_headers, json=action_json)
    print(post_action)

def update_current_states(data, file_path = 'dummy_config.json'):
    """
    Updates current states in config.json file
    """
    with open(file_path, 'w') as file:
        global stop
        global vent_state
        global shade_state
        
        global duration

        data['states']['stop'] = stop
        data['states']['vent_state'] = vent_state
        data['states']['shade_state'] = shade_state

        data['settings']['duration'] = duration

        json.dump(data, file, indent = 4)

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


def get_hostname_IP():
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
            global ack
            global stop
            global reboot
            global vent_states
            global vent_state
            global shade_states
            global shade_state

            def setActionToStatus(last_action, status):
                """
                Sets last action received in room to status
                """
                # Acknowledge action request
                action_json = {
                        "id": last_action['id'],
                        "status": status, #0 - unfulfilled, 1 - queued, 2 - pending, 3 - fulfilled
                        }
                print(f"\n action_json: {action_json}\n")

                patch_action = requests.patch(action_url, headers=req_headers, json=action_json)
                print(patch_action)

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
                        setActionToStatus(last_action, 1)

                        # Parse and execute new action request
                        if last_action['ack'] == 1:
                            ack = 1
                            setActionToStatus(last_action, 3)
                            ack = 0

                        if last_action['stop'] != stop:
                            stop = last_action['stop']
                            setActionToStatus(last_action, 3)

                        if last_action['reboot'] != reboot:
                            reboot = last_action['reboot']
                            setActionToStatus(last_action, 2)
                            simulate_reboot_pi()
                            setActionToStatus(last_action, 3)

                        if last_action['vent_state'] != vent_state: # Vent state has changed
                            if last_action['status'] != 3: # Not moving
                                simulate_toggle("vent")

                                # Begin action request
                                setActionToStatus(last_action, 2)
                                
                        if last_action['shade_state'] != shade_state: # Shade state has changed
                            if last_action['status'] != 3: # Not moving
                                simulate_toggle("shade")

                                # Begin action request
                                setActionToStatus(last_action, 2)

                else:
                    print(f'[{datetime.datetime.now()}] Last action requested at {last_action_timestamp}')

            # Current physical states
            print(f'Vent State: {vent_states[vent_state]},\nShade State: {shade_states[shade_state]},\n')
            
            # Other States
            if stop:
                print(f'[SYSTEM] STOPPING MEASUREMENTS\n')

            if reboot:
                print(f'[SYSTEM] REBOOTING SYSTEM\n')
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
            
def take_measurements(simulated=True):
    """
    Takes measurements and returns data
    """
    if simulated:
        global start_time
        # Temperature
        # temp = round(random.random() * 2.0 + 22, 2)
        elapsed_time_minutes = (time() - start_time) / 60
        temp = round(1 * math.sin(math.pi * elapsed_time_minutes / 3) + 25, 2) # 3 min period
        # Humidity
        hum = round(random.random() * 10 + 35, 2)
        # Light
        light= round(random.random() * 5 + 75, 2)
        # Air Pressure
        pres = round(random.random() * 5 + 990, 2)

    else: 
        global sense
        global adc
        temp = round(sense.get_temperature(), 2)
        hum = round(sense.get_humidity(), 2)
        light = adc.read(channel = 0)
        pres = round(sense.get_pressure(), 2)

    #Dataset
    dataSet = {'temperature': temp,
                'humidity': hum,
                'light': light,
                'pressure': pres}
    
    return dataSet 

if __name__ == "__main__":

    # Read configuration file and initialize states
    config_data = read_config()
    initialize_states(config_data)

    #initializing sensors
    # sense = SenseHat()
    # adc = MCP()

    # Get host name and ip address
    host_name, host_IP = get_hostname_IP()

    patch_response = requests.patch(agent_url, headers=req_headers, json={'device_ip_address': host_IP})
    print(patch_response.text)

    while True:
        print("****************************\n")
        if not stop:
            dataSet = take_measurements(simulated=True)
            print(dataSet)

            post_measurement = requests.post(server_url, headers=req_headers, json=dataSet)
            # print(post_measurement)
            print(post_measurement.text)

            server_data = json.loads(post_measurement.text)
            # print(int(server_data['duration']))

        if server_data is not None:
            sleep(int(server_data["duration"]))
            if duration != int(server_data["duration"]): 
                duration = int(server_data["duration"])
        else:
            sleep(duration)

        # Get data from room
        get_room = requests.get(f'http://{ServerIP}:5000/rooms/{roomID}')
        # print(get_room.json()['actions'])

        if vent_state < 2:
            if vent_moving:
                done = simulate_toggle("vent")
                if done:
                    vent_state = (vent_state * -1) + 1
                    post_current_states()
                    update_current_states(config_data)

        if shade_state < 2:
            if shade_moving:
                done = simulate_toggle("shade")
                if done:
                    shade_state = (shade_state * -1) + 1
                    post_current_states()
                    update_current_states(config_data)

        process_actions(get_room)