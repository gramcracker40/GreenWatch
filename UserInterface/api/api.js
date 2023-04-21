const url = "http://127.0.0.1:5000"

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
    registerUser(user) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }

        fetch(`${url}/register`, options)
        .then((res) => {
            if (res.ok) {
                console.log("User Created Successfully");
            }else{
                console.log(res);
            }
        })
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
        let response = await fetch(`${url}/users`);
        return await response.json();
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
    

    // ------------------ROOM------------------
    async listRooms() {
        let response = await fetch(`${url}/rooms`);
        return await response.json();
    }

    createRoom(name) {
        const room = {
            "greenhouse_id": 1,
            "name": name
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(room)
        }

        fetch(`${url}/rooms`, options)
        .then((res) => {
            if (res.ok) {
                console.log("Room Created Successfully");
            }else{
                console.log(res);
            }
        })
    }

    // Get room by id

    deleteRoom(room_id) {
        const auth = `Bearer ${sessionStorage.getItem('jwt')}`;
        // console.log(auth);

        const options = {
            method: 'DELETE',
            headers: {
                'Authorization': auth
            }
        }

        fetch(`${url}/rooms/${room_id}`, options)
        .then((res) => {
            if (res.ok) {
                console.log("Room Deleted Successfully");
            }else{
                console.log(res);
            }
        })
    }

    // Get room measurement by room id

    // Create room measurement by room id
    async createMeasurement(roomID, measurement) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(measurement)
        }

        try {
            let response = await fetch(`${url}/rooms/${roomID}/measurement`, options);
            if (response.status) {
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
      
        let response = await fetch(`${url}/rooms/${roomID}/messages`, options);
      
        // console.log(data);
      
        return await response.json();
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
// proxy.listRooms();
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