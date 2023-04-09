const url = "http://192.168.1.28:5000"
class GreenhouseProxy {
    constructor() {
        this.userRegister = {
            "first_name": "Billy",
            "last_name": "The Hero",
            "is_admin": true,
            "username": "test1", 
            "password":"password1",
            "email": "bHero@at.com"
        }

        this.o_user_register = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.userRegister)
        }

        this.userLogin = {
            "username": "test1",
            "password": "password1"
        }

        this.o_login = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.userLogin)
        }

        this.o_create_room = {

        }
    }

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
    registerUser() {
        fetch(`${url}/register`, this.o_user_register)
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

    // Update user by id

    // Delete user by id

    // ------------------ROOM------------------
    listRooms() {
        fetch(`${url}/rooms`)
        .then((res) => res.json())
        .then((data) => console.log(data));
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
    createMeasurement() {
        fetch(`${url}/`);
    }

    // Get all messages

    // Get all room messages by room id

    // Create new room message by room id

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

const proxy = new GreenhouseProxy();
// proxy.registerUser();
// proxy.login();
// proxy.createRoom("Room 1");
proxy.listRooms();
// proxy.deleteRoom(1);