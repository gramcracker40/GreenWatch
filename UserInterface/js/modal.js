import { GreenhouseProxy } from "../api/api.js";

const proxy = new GreenhouseProxy();
const usersButton = document.getElementById('users-modal-trigger');
const usersModalBody = document.getElementById('modal-users-body');

usersButton.addEventListener('click', renderUsers);

async function renderUsers() {
  // Get list of users
  const users = await proxy.getUsers();
  // console.log(users);

  // Create a new list for each user card item
  const listGroup = document.createElement('ul');
  listGroup.setAttribute('class', 'list-group');

  usersModalBody.append(listGroup);

  // Create user cards for user settings modal
  users.forEach(user => {
    const fullname = user['first_name'] + ' ' + user['last_name'];
    const listGroupItem = document.createElement('li');
    const username = document.createElement('div');
    const icons = document.createElement('div');
    const edit = document.createElement('i');
    const trash = document.createElement('i');

    listGroupItem.setAttribute('class', 'list-group-item justify-content-between d-flex align-items-center');
    // Set username text content
    username.textContent = fullname;
    // set icon classes, type, and id
    edit.setAttribute('class', 'fa-solid fa-pen-to-square btn btn-outline-dark m-2');
    trash.setAttribute('class', 'fa-solid fa-trash btn btn-outline-dark m-2');

    listGroup.append(listGroupItem);
    listGroupItem.append(username);
    listGroupItem.append(icons);
    icons.append(edit);
    icons.append(trash);

    edit.addEventListener('click', () => {
      console.log('Edit Clicked');
    });

    trash.addEventListener('click', () => {
      console.log('Trash Clicked');
    });
  });
}


// Open Modal when button clicked
// const modalTrigger = document.querySelector('.modal-trigger');
// const modalCreate = document.querySelector('.modal-create');
// const modal = document.querySelector('.modal');

// modalTrigger.addEventListener('click', function() {
//   modal.style.display = "block";
// });

// modalCreate.addEventListener('click', function() {
//   const roomName = document.getElementById("roomnameTextbox").value;

//   console.log(roomName);

//   const room = {
//     "name": roomName,
//     "greenhouse_id": 1
//   }

//   // Make api post request with room name.
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(room)
//   }

//   createRoom(options);
// });

// // Close Modal when close button clicked
// const closeButton = document.querySelector('.close-button');

// closeButton.addEventListener('click', function() {
//   modal.style.display = "none";
// });

// // Close Modal when user clicks anywhere outside of the modal
// window.addEventListener('click', function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// });

// function createRoom(options) {
//   fetch('http://192.168.1.115:5000/rooms', options)
//   .then((res) => {
//     if (res.ok) {
//       setTimeout(function() {
//         window.location.href = 'roompage.html';
//       }, 3000);
//     }else{
//       console.log(res.body);
//     }
//   })
// }