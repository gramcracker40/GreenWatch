
const url = "http://127.0.0.1:5000"
const token = `Bearer ${sessionStorage.getItem('jwt')}`;

// const userRegister1 = {
//     "first_name": "Billy",
//     "last_name": "The Hero",
//     "is_admin": true,
//     "username": "test1", 
//     "password":"password1",
//     "email": "bHero@at.com"
// }

// const userRegister2 = {
//     "first_name": "Finn",
//     "last_name": "The Human",
//     "is_admin": true,
//     "username": "finn", 
//     "password":"pb",
//     "email": "fHuman@at.com"
// }

// const userRegister3 = {
//     "first_name": "Jake",
//     "last_name": "The Dog",
//     "is_admin": true,
//     "username": "jtdoggzone", 
//     "password":"lady",
//     "email": "jDog@at.com"
// }

// const o_user_register = {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(this.userRegister1)
// }

// const userLogin = {
//     "username": "test1",
//     "password": "password1"
// }

// const o_login = {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(this.userLogin)
// }

// const o_create_room = {

// }

export class GreenhouseProxy {
    constructor() {}

    parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }
    
    getJwt(obj) {
        return JSON.parse(obj)["access_token"];
    }

    // ------------------USERS------------------
    async registerUser(user) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }

        try {
            let response = await fetch(`${url}/register`, options);
            // if (response.ok) {
            //     console.log("User Created Successfully");
            // }
        } catch (error) {
            console.log(error);
        }        
    }

    login() {
        fetch(`${url}/login`, this.o_login)
        .then((res) => {
            if (res.ok) {
                console.log("Login Successful");
                // console.log(res.body);
                res.text()
                .then((result) => sessionStorage.setItem('jwt', this.getJwt(result)));
                // console.log(res);
            }else{
                console.log("Invalid Login");
            }
        })
        // .then((data) => console.log(data));
    }

    // Logout

    // Refresh

    // Get all users
    async getUsers() {
        try {
            let response = await fetch(`${url}/users`);
            return await response.json();
        } catch (error) {
            console.log(error);
        }
        
    }

    // Update user by id
    async editUser(userID, userData) {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }
        
        try {
            let response = await fetch(`${url}/users/${userID}`, options);
            if (response.ok) {
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
            method: 'DELETE'
        }

        try {
            let response = await fetch(`${url}/users/${userID}`, options);
            if (response.ok) {
                console.log("User Deleted Successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }
    

    // ------------------ROOM------------------
    async getRooms() {
        try {
            let response = await fetch(`${url}/rooms`);
            return await response.json();
        } catch (error) {
            console.log(error);
        }
        
    }

    async createRoom(room) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(room)
        }

        try {
            let response = await fetch(`${url}/rooms`, options);
            if (response.ok) {
                console.log("Room Created Successfully");
            }
        } catch (error) {
            console.log(error);
        }        
    }

    // Get room by id

    async deleteRoom(room_id) {
        const options = {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        }

        try {
            let response = await fetch(`${url}/rooms/${room_id}`, options);
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
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dateObj)
        }

        try {
            let response = await fetch(`${url}/rooms/${roomID}/measurement`, options);
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
        console.log(measurement);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Key': 'X5L50RUAOJ8N4X4DZ4MSHF0L1I5UOXBEQOL0H4KBW5TKNJU6QAB46J07TTY1' // Agent Key for Room 1
            },
            body: JSON.stringify(measurement)
        }

        try {
            let response = await fetch(`${url}/rooms/${roomID}/measurement`, options);
            if (response.ok) {
                console.log("Measurement Created Successfully");
            }
        } 
        catch (error) {
            console.log(error);
        }
    }

    // Get all messages
    getAllMessages() {
        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        fetch(`${url}/rooms/messages`, options)
        .then((res) => res.json())
        .then((data) => console.log(data));
    }

    // Get all room messages by room id
    async getAllMessagesByRoom(roomID) {
        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
      
        try {
            let response = await fetch(`${url}/rooms/${roomID}/messages`, options);
            return await response.json();
        } catch (error) {
            console.log(error);
        }
    }

    // Create new room message by room id
    createRoomMessage(roomID, userID, message) {
        const _body = {
            "user_id": userID,
            "body": message
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_body)
        }

        fetch(`${url}/rooms/${roomID}/messages`, options)
        .then((res) => {
            if (res.ok) {
                console.log("Message Successfully Created");
            }else{
                console.log(res);
            }
        });
    }

    // Update a message by message id

    // Delete a message by message id

    // ------------------EXPERIMENT------------------
    // Get all experiments

    // Create an experiment

    // Get experiment by id

    // Update experiment by id

    // Delete experiment by id

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

    // Create an agent on a server

    // Update an agent by id

    // Delete an agent by id
}

// const proxy = new GreenhouseProxy();
// proxy.registerUser(userRegister2);
// proxy.registerUser(userRegister3);
// proxy.login();
// proxy.getUsers();
// proxy.createRoom("Room 1");
// proxy.getRooms();
// proxy.deleteRoom(1);
// proxy.createMeasurement(1, measurement);
// proxy.getAllMessages();
// proxy.getAllMessagesByRoom(1);
// proxy.getAllMessagesByRoom(2);
// proxy.getAllMessagesByRoom(3);
// proxy.getAllMessagesByRoom(4);
// proxy.createRoomMessage(4, 1, "That sounds like a great idea. Let's do it!");

// const measurements = [
//     {
//         "temperature": 98,
//         "humidity": 73,
//         "pressure": 21,
//         "light": 4
//     },
//     {
//         "temperature": 95,
//         "humidity": 79,
//         "pressure": 18,
//         "light": 3
//     },
//     {
//         "temperature": 97,
//         "humidity": 74,
//         "pressure": 19,
//         "light": 4
//     },
//     {
//         "temperature": 97,
//         "humidity": 77,
//         "pressure": 23,
//         "light": 2
//     },
// ]

// let roomID = 1;

// measurements.forEach(measurment => {
//     proxy.createMeasurement(roomID, measurment);
//     roomID++;
// });

async function createRoomMeasurements() {
    const proxy = new GreenhouseProxy();
    // const rooms = await proxy.getRooms();

    const measurements = [
        {
          "humidity": 88,
          "temperature": 83,
          "light": 240,
          "pressure": 1014.17
        },
        {
          "humidity": 65,
          "temperature": 36,
          "light": 19,
          "pressure": 1009.95
        },
        {
          "humidity": 62,
          "temperature": 35,
          "light": 169,
          "pressure": 1014.13
        },
        {
          "humidity": 89,
          "temperature": 69,
          "light": 247,
          "pressure": 1011.32
        },
        {
          "humidity": 93,
          "temperature": 74,
          "light": 60,
          "pressure": 1018.41
        },
        {
          "humidity": 63,
          "temperature": 80,
          "light": 195,
          "pressure": 1010.96
        },
        {
          "humidity": 52,
          "temperature": 97,
          "light": 230,
          "pressure": 1015.26
        },
        {
          "humidity": 52,
          "temperature": 38,
          "light": 142,
          "pressure": 1015.76
        },
        {
          "humidity": 53,
          "temperature": 53,
          "light": 215,
          "pressure": 1005.65
        },
        {
          "humidity": 63,
          "temperature": 57,
          "light": 212,
          "pressure": 1009.46
        },
        {
          "humidity": 88,
          "temperature": 60,
          "light": 76,
          "pressure": 1017.95
        },
        {
          "humidity": 88,
          "temperature": 68,
          "light": 242,
          "pressure": 1018.35
        },
        {
          "humidity": 79,
          "temperature": 27,
          "light": 128,
          "pressure": 1007.16
        },
        {
          "humidity": 58,
          "temperature": 32,
          "light": 121,
          "pressure": 1016.42
        },
        {
          "humidity": 77,
          "temperature": 41,
          "light": 200,
          "pressure": 1018.28
        },
        {
          "humidity": 93,
          "temperature": 50,
          "light": 105,
          "pressure": 1002.8
        },
        {
          "humidity": 84,
          "temperature": 79,
          "light": 13,
          "pressure": 1017.5
        },
        {
          "humidity": 66,
          "temperature": 38,
          "light": 84,
          "pressure": 1009.73
        },
        {
          "humidity": 92,
          "temperature": 34,
          "light": 235,
          "pressure": 1000.99
        },
        {
          "humidity": 100,
          "temperature": 82,
          "light": 121,
          "pressure": 1008.22
        }
      ]

    var counter = 1;

    var interval = setInterval(function() { 
    if (counter <= 20) { 
        proxy.createMeasurement(1, measurements[counter-1]);
        console.log(measurements[counter-1]);
        counter++;
    }
    else { 
        clearInterval(interval);
    }
    }, 5000);
}

async function createRoomMeasurement() {
    const proxy = new GreenhouseProxy();
    // const rooms = await proxy.getRooms();

   

    const measurement = {
        "humidity": 88,
        "temperature": 83,
        "light": 240,
        "pressure": 1014.17
    }

    console.log(measurement);
    proxy.createMeasurement(1, measurement);
}

const createMeasurementButton = document.getElementById('create-measurements-button');
if (createMeasurementButton) {
    createMeasurementButton.addEventListener('click', createRoomMeasurement);
}