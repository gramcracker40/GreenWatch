import { GreenhouseProxy } from "../api/api.js";

const proxy = new GreenhouseProxy();
const usersButton = document.getElementById('users-modal-trigger');
const usersModalBody = document.getElementById('modal-users-body');
const roomsButton = document.getElementById('rooms-modal-trigger');
const roomsModalBody = document.getElementById('modal-rooms-body');

usersButton.addEventListener('click', renderUsers);
roomsButton.addEventListener('click', renderRooms);

 // Create a new list for each user card item
 const userListGroup = document.createElement('ul');
 userListGroup.setAttribute('class', 'list-group');

 // Create a new list to hold each room card item
 const roomListGroup = document.createElement('ul');
 roomListGroup.setAttribute('class', 'list-group');

function resetUserList() {
  while(userListGroup.firstChild) {
    userListGroup.removeChild(userListGroup.lastChild);
  }
}

async function renderUsers() {
  // Reset current list
  resetUserList();

  // Get list of users
  const users = await proxy.getUsers();
  console.log(users);

  usersModalBody.append(userListGroup);

  // Create user cards for user settings modal
  users.forEach(user => {
    const fullname = user['first_name'] + ' ' + user['last_name'];
    const userListGroupItem = document.createElement('li');
    const username = document.createElement('div');
    const icons = document.createElement('div');
    const edit = document.createElement('i');
    const trash = document.createElement('i');

    userListGroupItem.setAttribute('class', 'list-group-item justify-content-between d-flex align-items-center');
    // listGroupItem.setAttribute('id', user['id']);
    // Set username text content
    username.textContent = fullname;
    // set icon classes, type, and id
    edit.setAttribute('class', 'fa-solid fa-pen-to-square btn btn-outline-dark m-2');
    edit.setAttribute('data-bs-target', '#users-modal-edit');
    edit.setAttribute('data-bs-toggle', 'modal');
    trash.setAttribute('class', 'fa-solid fa-trash btn btn-outline-danger m-2');
    trash.setAttribute('data-bs-target', '#users-modal-delete');
    trash.setAttribute('data-bs-toggle', 'modal');

    userListGroup.append(userListGroupItem);
    userListGroupItem.append(username);
    userListGroupItem.append(icons);
    icons.append(edit);
    icons.append(trash);

    edit.addEventListener('click', () => {
      sessionStorage.setItem('selectdUser', user);
      const modalTitle = document.getElementById('user-edit-modal-title');
      modalTitle.textContent = `Editing: ${fullname}`;
    });

    trash.addEventListener('click', () => {
      sessionStorage.setItem('userID', user['id']);
      const deletedUser = document.getElementById('user-delete-text');
      deletedUser.textContent = `${fullname}`;
    });
  });
}

async function editUser() {
  // Pull user from session storage for use in edit modal
  const previousUser = sessionStorage.getItem('user');
  sessionStorage.removeItem('user');

  // Get values from input fields
  const password = document.getElementById('edit-password')
  const username = document.getElementById('edit-username')
  const isAdmin = document.getElementById('edit-admin-status')
  const firstName = document.getElementById('edit-first-name')
  const lastName = document.getElementById('edit-last-name')
  const email = document.getElementById('edit-email')

  // Load user object with input field values
  const user = {
    "password": password.value,
    "username": username.value,
    "is_admin": Boolean(isAdmin.value),
    "first_name": firstName.value,
    "last_name": lastName.value,
    "email": email.value
  }

  const keys = Object.keys(user);

  for (const key in keys) {
    if (user[key] == "") {
      user[key] = previousUser[key];
    }
  }

  console.log(user);
  console.log(previousUser);
  // await proxy.editUser(userID, user);
  renderUsers();

  // Reset input field values
  password.value = "";
  username.value = "";
  isAdmin.value = "0";
  firstName.value = "";
  lastName.value = "";
  email.value = "";
}

function checkCreateInputFields() {
  const emptyFieldsText = document.getElementById('user-create-invalid-text');
  const password = document.getElementById('create-password')
  const username = document.getElementById('create-username')
  const isAdmin = document.getElementById('create-admin-status')
  const firstName = document.getElementById('create-first-name')
  const lastName = document.getElementById('create-last-name')
  const email = document.getElementById('create-email')

  const user = {
    "password": password.value,
    "username": username.value,
    "is_admin": Boolean(isAdmin).value,
    "first_name": firstName.value,
    "last_name": lastName.value,
    "email": email.value
  }

  // Loop through input fields and check if they are empty.
  // If they are, then disable the create button and signify that the credentials are invalid.
  const keys = Object.keys(user);
  console.log(keys);

  for (const key in keys) {
    if (user[key] == null) {
      createButton.disabled = true;
      emptyFieldsText.style.visibility = 'visible';
    }
  }
}

async function createUser() {
  const userCreateModal = document.getElementById('users-modal-create-footer');

  checkCreateInputFields();
}

async function deleteUser() {
  const userID = sessionStorage.getItem('userID');
  sessionStorage.removeItem('userID');

  proxy.deleteUser(userID);
}

const saveButton = document.getElementById('save-user-button');
saveButton.addEventListener('click', editUser);

const addUserButton = document.getElementById('add-user-button');
addUserButton.addEventListener('click', checkCreateInputFields);

const createButton = document.getElementById('create-user-button');
createButton.addEventListener('click', createUser);

const deleteButton = document.getElementById('delete-user-button');
deleteButton.addEventListener('click', deleteUser);

function resetRoomList() {
  while(roomListGroup.firstChild) {
    roomListGroup.removeChild(roomListGroup.lastChild);
  }
}

async function renderRooms() {
  // Reset current list
  resetRoomList();

  // Get list of users
  const rooms = await proxy.listRooms();
  console.log(rooms);

  roomsModalBody.append(roomListGroup);

  // Create user cards for user settings modal
  rooms.forEach(room => {
    const roomListGroupItem = document.createElement('li');
    const roomName = document.createElement('div');
    const icons = document.createElement('div');
    const trash = document.createElement('i');

    roomListGroupItem.setAttribute('class', 'list-group-item justify-content-between d-flex align-items-center');

    // Set username text content
    roomName.textContent = room['name'];
    // set icon classes, type, and id
    trash.setAttribute('class', 'fa-solid fa-trash btn btn-outline-danger m-2');
    trash.setAttribute('data-bs-target', '#rooms-modal-delete');
    trash.setAttribute('data-bs-toggle', 'modal');

    roomListGroup.append(roomListGroupItem);
    roomListGroupItem.append(roomName);
    roomListGroupItem.append(icons);
    icons.append(trash);

    trash.addEventListener('click', () => {
      sessionStorage.setItem('roomID', room['id']);
      const deletedRoom = document.getElementById('room-delete-text');
      deletedRoom.textContent = `${room['name']}`;
    });
  });
}