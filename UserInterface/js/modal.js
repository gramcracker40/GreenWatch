import { GreenhouseProxy } from "../api/api.js";

const proxy = new GreenhouseProxy();
const usersButton = document.getElementById('users-modal-trigger');
const usersModalBody = document.getElementById('modal-users-body');

usersButton.addEventListener('click', renderUsers);

 // Create a new list for each user card item
 const listGroup = document.createElement('ul');
 listGroup.setAttribute('class', 'list-group');

function resetUserList() {
  while(listGroup.firstChild) {
    listGroup.removeChild(listGroup.lastChild);
  }
}

async function renderUsers() {
  // Reset current list
  resetUserList();

  // Get list of users
  const users = await proxy.getUsers();
  console.log(users);

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
    // listGroupItem.setAttribute('id', user['id']);
    // Set username text content
    username.textContent = fullname;
    // set icon classes, type, and id
    edit.setAttribute('class', 'fa-solid fa-pen-to-square btn btn-outline-dark m-2');
    edit.setAttribute('data-bs-target', '#users-modal-edit');
    edit.setAttribute('data-bs-toggle', 'modal');
    trash.setAttribute('class', 'fa-solid fa-trash btn btn-outline-dark m-2');

    listGroup.append(listGroupItem);
    listGroupItem.append(username);
    listGroupItem.append(icons);
    icons.append(edit);
    icons.append(trash);

    edit.addEventListener('click', () => {
      sessionStorage.setItem('userID', user['id']);
      const modalTitle = document.getElementById('user-edit-modal-title');
      modalTitle.textContent = `Editing: ${fullname}`;
    });

    trash.addEventListener('click', () => {
      console.log('Trash Clicked');
    });
  });
}

async function editUser() {
  const userID = sessionStorage.getItem('userID');
  sessionStorage.removeItem('userID');

  const password = document.getElementById('edit-password').value
  const username = document.getElementById('edit-username').value
  const isAdmin = document.getElementById('edit-admin-status').value
  const firstName = document.getElementById('edit-first-name').value
  const lastName = document.getElementById('edit-last-name').value
  const email = document.getElementById('edit-email').value

  const user = {
    "password": password,
    "username": username,
    "is_admin": Boolean(isAdmin),
    "first_name": firstName,
    "last_name": lastName,
    "email": email
  }

  console.log(user);
  console.log(userID);
  await proxy.editUser(userID, user);
  renderUsers();

  password.value = "";
  username.value = "";
  isAdmin.value = "0";
  firstName.value = "";
  lastName.value = "";
  email.value = "";
}

async function createUser() {
  const userCreateModal = document.getElementById('users-modal-create-footer');

  const password = document.getElementById('create-password').value
  const username = document.getElementById('create-username').value
  const isAdmin = document.getElementById('create-admin-status').value
  const firstName = document.getElementById('create-first-name').value
  const lastName = document.getElementById('create-last-name').value
  const email = document.getElementById('create-email').value

  const user = {
    "password": password,
    "username": username,
    "is_admin": Boolean(isAdmin),
    "first_name": firstName,
    "last_name": lastName,
    "email": email
  }

  for (const field in user) {
    if (field == "") {
      createButton.ariaDisabled = true;
    }
  }
}

const saveButton = document.getElementById('save-user-button');
saveButton.addEventListener('click', editUser);

const createButton = document.getElementById('create-user-button');
createButton.addEventListener('click', createUser);

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