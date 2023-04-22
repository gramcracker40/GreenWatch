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
      sessionStorage.setItem('userID', user['id']);
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

async function deleteUser() {
  const userID = sessionStorage.getItem('userID');
  sessionStorage.removeItem('userID');

  proxy.deleteUser(userID);
}

const saveButton = document.getElementById('save-user-button');
saveButton.addEventListener('click', editUser);

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