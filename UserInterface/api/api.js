import * as Utils from "../js/utilities.js";

// var thisFile = document.getElementById('api-script');

// const url = thisFile.getAttribute('server_ip');
// console.log(url)
const token = `Bearer ${sessionStorage.getItem('access_token')}`;
let debugMode = false;

const default_headers = {
    'Authorization': token,
    'Content-Type': 'application/json'
}

export class GreenhouseProxy {
    constructor() {
        // this.debugMode = false;

        
    }

    // ------------------USERS------------------
    async registerUser(user) {
        const options = {
            method: 'POST',
            headers: default_headers,
            body: JSON.stringify(user)
        }

        try {
            let response = await fetch(`/register`, options);
            if (response.ok && debugMode) {
                console.log("User Created Successfully");
            }
        } catch (error) {
            console.log(error);
        }        
    }

    async login(loginObj) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginObj)
        }

        try {
            let response = await fetch(`/login`, options);
            if (response.ok) {
                if (debugMode) {
                    console.log("Login Successful");
                }

                let data = await response.json();
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Logout

    // Refresh

    // Get all users
    async getUsers() {
        const options = {
            headers: default_headers
        }

        try {
            let response = await fetch(`/users`, options);
            if (response.ok) {
                let data = await response.json();

                if (debugMode) {
                    console.log("Successfully Aquired Users");
                    console.log(data);
                }

                return data;
            }
            
        } catch (error) {
            console.log(error);
        }
        
    }

    // Update user by id
    async editUser(userID, userData) {
        const options = {
            method: 'PATCH',
            headers: default_headers,
            body: JSON.stringify(userData)
        }
        
        try {
            let response = await fetch(`/users/${userID}`, options);
            if (response.ok && debugMode) {
                console.log("User Successfully Updated");
                console.log(await response.json());
            }
        } catch (error) {
            console.log(error);
        }
        
    }

    // Delete user by id
    async deleteUser(userID) {
        const options = {
            method: 'DELETE',
            headers: default_headers
        }

        try {
            let response = await fetch(`/users/${userID}`, options);
            if (response.ok) {
                console.log("User Deleted Successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }
    

    // ------------------ROOM------------------ //
    // Get all rooms
    async getRooms() {
        const options = {
            headers: default_headers
        }

        try {
            let response = await fetch(`/rooms`, options);
            return await response.json();
        } catch (error) {
            console.log(error);
        }
        
    }

    // Create a new room
    async createRoom(room) {
        const options = {
            method: 'POST',
            headers: default_headers,
            body: JSON.stringify(room)
        }

        try {
            let response = await fetch(`/rooms`, options);
            if (response.ok) {
                console.log("Room Created Successfully");
            }
        } catch (error) {
            console.log(error);
        }        
    }

    // Get room by id
    async getRoomByID(roomID) {
        const options = {
            headers: default_headers
        }

        try {
            let response = await fetch(`/rooms/${roomID}`, options);
            if (response.ok) {
                let data = await response.json();
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Update a room by ID
    async editRoom(roomID, name) {

        const options = {
            method: 'PATCH',
            headers: default_headers,
            body: JSON.stringify(name)
        }

        try {
            let response = await fetch(`/rooms/${roomID}`, options);
            if (response.ok && debugMode) {
                console.log("Room Successfully Updated");
            }
        } catch (error) {
            if (debugMode) {
                console.log(error);
            }
        }
    }

    // Delete a room by ID
    async deleteRoom(room_id) {
        const options = {
            method: 'DELETE',
            headers: default_headers
        }

        try {
            let response = await fetch(`/rooms/${room_id}`, options);
            if (response.ok) {
                console.log("Room Deleted Successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Get room measurement by room id
    async getMeasurementByRoom(roomID, dateObj) {
        const options = {
            method: 'PUT',
            headers: default_headers,
            body: JSON.stringify(dateObj)
        }
        console.log('PROXY: Getting measurment by room: room ' + roomID)

        try {
            // let response = await fetch(`/rooms/${roomID}/measurement`, options);
            let response = await fetch(`/rooms/${roomID}/`, options);
            if (response.ok) {
                let data = await response.json();
                console.log(data);
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Create room measurement by room id
    async createMeasurement(roomID, measurement) {
        const options = {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Key': 'TRD1IU4G5E45RZU8UOXNNMR7WID34Q7SM0EFHV6FHZS9PQBNYXINTTS1BSR8' // Agent Key for Room 1
            },
            body: JSON.stringify(measurement)
        }

        try {
            let response = await fetch(`/rooms/${roomID}/measurement`, options);
            if (response.ok) {
                // console.log("Measurement Created Successfully");
            }
        } 
        catch (error) {
            console.log(error);
        }
    }

    // Get all messages
    getAllMessages() {
        const options = {
            headers: default_headers
        }

        fetch(`/rooms/messages`, options)
        .then((res) => res.json())
        .then((data) => console.log(data));
    }

    // Get all room messages by room id
    async getAllMessagesByRoom(roomID) {
        const options = {
            headers: default_headers
        }
      
        try {
            let response = await fetch(`/rooms/${roomID}/messages`, options);
            if (response.ok) {
                let data = await response.json();
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Create new room message by room id
    async createRoomMessage(roomID, userID, message) {
        const _body = {
            "user_id": userID,
            "body": message
        }

        const options = {
            method: 'POST',
            headers: default_headers,
            body: JSON.stringify(_body)
        }

        try {
            let response = await fetch(`/rooms/${roomID}/messages`, options);
            if (response.ok && debugMode) {
                console.log("Messages Created Successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Update a message by message id

    // Delete a message by message id

    // ------------------EXPERIMENT------------------
    // Get all experiments
    async getExperiments() {
        const options = {
            headers: default_headers
        }

        try {
            let response = await fetch(`/experiments`, options);
            if (response.ok) {
                let data = await response.json();
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Create an experiment
    async createExpirement(experimentObj) {
        const options = {
            method: 'POST',
            headers: default_headers,
            body: JSON.stringify(experimentObj)
        }

        try {
            let response = await fetch(`/experiments`, options);
            if (response.ok) {
                console.log("Experiment Created Successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Get experiment by id
    async getExperimentByID(experimentID) {
        const options = {
            headers: default_headers
        }

        try {
            let response = await fetch(`/experiments/${experimentID}`, options);
            if (response.ok) {
                let data = await response.json();
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Update experiment by id
    async editExperiment(experimentID, experimentObj) {
        const options = {
            method: 'PATCH',
            headers: default_headers,
            body: JSON.stringify(experimentObj)
        }

        try {
            let response = await fetch(`/experiments/${experimentID}`, options);
            if (response.ok) {
                console.log("Experiment Updated Successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Delete experiment by id
    async deleteExperiment(experimentID) {
        const options = {
            method: 'DELETE',
            headers: default_headers
        }

        try {
            let response = await fetch(`/experiments/${experimentID}`, options);
            if (response.ok) {
                console.log("Experiment Deleted Successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Add user to experiment by experiment and user IDs

    // Delete a user from an experiment by experiment and user IDs

    // ------------------GREENHOUSE------------------
    // Get greenhouse by id

    // Update greenhouse by id

    // Delete greenhouse by id

    // Get all greenhouses

    // Create a new greenhouse

    // ------------------SERVER------------------
    // Get all servers

    // Create a new server

    // Update a server by id

    // Delete a server by id

    // Get all agents on a server

    // Get all agents
    async getAgents() {
        const options = {
            headers: default_headers
        }

        try {
            let response = await fetch(`/servers/agents`, options);
            return await response.json();
        } catch (error) {
            console.log(error);
        }
        
    }

    // Get agent by id
    async getAgentByID(roomID) {
        const options = {
            headers: default_headers
        }

        try {
            let response = await fetch(`/servers/agents/${roomID}`, options);
            if (response.ok) {
                let data = await response.json();
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Create an agent on a server
    async createAgent(agentObj) {
        const options = {
            method: 'POST',
            headers: default_headers,
            body: JSON.stringify(agentObj)
        }

        try {
            let response = await fetch(`/servers/agents`, options);
            if (response.ok) {
                console.log("Agent Created Successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Download agent by id
    

    // Update an agent by id

    // Delete an agent by id
}
