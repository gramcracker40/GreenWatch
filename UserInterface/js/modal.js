import { GreenhouseProxy } from "../api/api.js";
import * as Utils from "../js/utilities.js";
import { renderRoomCards } from "./home.js";

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
usersModalBody.append(userListGroup);

// Create a new list to hold each room card item
const roomListGroup = document.createElement('ul');
roomListGroup.setAttribute('class', 'list-group');
roomsModalBody.append(roomListGroup);

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
  // console.log(users);

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

    // if the user is an admin, then append the icons
    // if (user['id'] != Utils.getJwt()['user_id'] && !user['is_admin']) {
    //   userListGroupItem.append(icons);
    //   icons.append(trash);
    //   icons.append(edit);
    // }

    edit.addEventListener('click', () => {
      const userString = JSON.stringify(user);
      // console.log(userString);
      sessionStorage.setItem('selectedUser', userString);
      sessionStorage.setItem('selectedUserID', user['id']);
      const modalTitle = document.getElementById('user-edit-modal-title');
      modalTitle.textContent = `Editing: ${fullname}`;
      document.addEventListener('keyup', checkEditUserInputFields);
      document.addEventListener('mouseup', checkEditUserInputFields);
      setUserEditPlaceholderValues(user);
      checkEditUserInputFields();
    });

    trash.addEventListener('click', () => {
      sessionStorage.setItem('userID', user['id']);
      const deletedUser = document.getElementById('user-delete-text');
      deletedUser.textContent = `${fullname}`;
    });
  });
}

async function editUser() {
  const userID = sessionStorage.getItem('selectedUserID');
  sessionStorage.removeItem('selectedUserID');
  const potentialUser = getEditUserObject();
  const user = populateEmptyFields(potentialUser);
  // console.log(user);
  await proxy.editUser(userID, user);
  renderUsers();
  resetEditUserInputFields();
}

function resetEditUserInputFields() {
  const password = document.getElementById('edit-password');
  const username = document.getElementById('edit-username');
  const isAdmin = document.getElementById('edit-admin-status');
  const firstName = document.getElementById('edit-first-name');
  const lastName = document.getElementById('edit-last-name');
  const email = document.getElementById('edit-email');

  // Reset input field values
  password.value = "";
  username.value = "";
  isAdmin.value = "";
  firstName.value = "";
  lastName.value = "";
  email.value = "";
}

function checkEditUserInputFields() {
  // console.log("checking edit input fields");
  // Storing in variables so both functions run 
  // instead of accidentally short circuiting the other 
  // within if statement below.
  const password = document.getElementById('edit-password');
  const strongPassword = isStrongPassword(password.value);
  
  const passwordParamText = document.getElementById('user-edit-invalid-password-text');

  // Check if inputfields are empty and if the password is strong.
  // If both are true, then allow for the creation of the user.
  if (!strongPassword) {
    // console.log("weak password");
    editUserButton.disabled = true;
    passwordParamText.style.visibility = 'visible';
  }else{
    // console.log("strong password");
    editUserButton.disabled = false;
    passwordParamText.style.visibility = 'hidden';
  }
}

function setUserEditPlaceholderValues() {
  const previousUserString = sessionStorage.getItem('selectedUser');
  const previousUser = JSON.parse(previousUserString);
  // console.log(previousUser);

  // Get values from input fields
  // const password = document.getElementById('edit-password');
  const username = document.getElementById('edit-username');
  const isAdmin = document.getElementById('edit-admin-status');
  const firstName = document.getElementById('edit-first-name');
  const lastName = document.getElementById('edit-last-name');
  const email = document.getElementById('edit-email');

  // Set placeholder values of inputs
  // password.setAttribute('placeholder', previousUser['password']);
  username.setAttribute('placeholder', previousUser['username']);
  isAdmin.setAttribute('placeholder', previousUser['is_admin']);
  firstName.setAttribute('placeholder', previousUser['first_name']);
  lastName.setAttribute('placeholder', previousUser['last_name']);
  email.setAttribute('placeholder', previousUser['email']);
}

function populateEmptyFields() {
  const user = getEditUserObject();
  // Pull previous user from session storage
  const previousUserString = sessionStorage.getItem('selectedUser');
  const previousUser = JSON.parse(previousUserString);
  // console.log(previousUser);
  // sessionStorage.removeItem('user');

  // password.value = previousUser['password'];
  // username.value = previousUser['username'];
  // isAdmin.value = previousUser['is_admin'];
  // firstName.value = previousUser['firstname'];
  // lastName.value = previousUser['lastName'];
  // email.value = previousUser['email'];
  console.log(user);
  // Populate any field that is empty
  for (const key in user) {
    if (user[key] == "" && key != "password") {
      user[key] = previousUser[key];
    }
  }
  console.log(user);
  return user;
}

function getEditUserObject() {
  const password = document.getElementById('edit-password');
  const username = document.getElementById('edit-username');
  const isAdmin = document.getElementById('edit-admin-status');
  const firstName = document.getElementById('edit-first-name');
  const lastName = document.getElementById('edit-last-name');
  const email = document.getElementById('edit-email');

  // Load user object with input field values
  const user = {
    "password": password.value,
    "username": username.value,
    "is_admin": Boolean(isAdmin.value),
    "first_name": firstName.value,
    "last_name": lastName.value,
    "email": email.value
  }

  return user;
}

function isStrongPassword(password) {
  // console.log(`Testing: ${password}`);
  const strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');

  if (!strongPassword.test(password)) {
    return false;
  }
  return true;
}

function isCreateUserFieldsEmpty(user) {
  const emptyFieldsCreateUserText = document.getElementById('user-create-invalid-text');

  for (const key in user) {
    if (user[key] == "") {
      emptyFieldsCreateUserText.style.visibility = 'visible';
      return true;
    }
  }
  emptyFieldsCreateUserText.style.visibility = 'hidden';
  return false;
}

function checkCreateUserInputFields() {
  const user = getCreateUserObject();

  // Storing in variables so both functions run 
  // instead of accidentally short circuiting the other 
  // within if statement below.
  const fieldsEmpty = isCreateUserFieldsEmpty(user);
  const strongPassword = isStrongPassword(user['password']);

  const passwordParamText = document.getElementById('user-create-invalid-password-text');

  if (!strongPassword) {
    passwordParamText.style.visibility = 'visible';
  }else{
    passwordParamText.style.visibility = 'hidden';
  }
  
  // Check if inputfields are empty and if the password is strong.
  // If both are true, then allow for the creation of the user.
  if (!fieldsEmpty && strongPassword) {
    createUserButton.disabled = false;
  }else{
    createUserButton.disabled = true;
  }
}

function resetCreateUserInputFields() {
  const password = document.getElementById('create-password');
  const username = document.getElementById('create-username');
  const isAdmin = document.getElementById('create-admin-status');
  const firstName = document.getElementById('create-first-name');
  const lastName = document.getElementById('create-last-name');
  const email = document.getElementById('create-email');

  password.value = "";
  username.value = "";
  isAdmin.value = "";
  firstName.value = "";
  lastName.value = "";
  email.value = "";
}

function getCreateUserObject() {
  const password = document.getElementById('create-password');
  const username = document.getElementById('create-username');
  const isAdmin = document.getElementById('create-admin-status');
  const firstName = document.getElementById('create-first-name');
  const lastName = document.getElementById('create-last-name');
  const email = document.getElementById('create-email');

  const user = {
    "password": password.value,
    "username": username.value,
    "is_admin": isAdmin.value,
    "first_name": firstName.value,
    "last_name": lastName.value,
    "email": email.value
  }

  return user;
}

async function createUser() {
  const user = getCreateUserObject();
  console.log(user);
  // Convert admin status to boolean after checking for empty fields.
  user['is_admin'] = Boolean(parseInt(user['is_admin'])); 
  console.log(user);

  await proxy.registerUser(user);
  resetCreateUserInputFields();
  renderUsers();
}

async function deleteUser() {
  const userID = sessionStorage.getItem('userID');
  sessionStorage.removeItem('userID');

  await proxy.deleteUser(userID);
  renderUsers();
}

// -------------------- USER MODAL BUTTONS -------------------- //
// add user modal popup
const addUserButton = document.getElementById('add-user-button');
addUserButton.addEventListener('click', checkCreateUserInputFields);
addUserButton.addEventListener('click', () => {
  document.addEventListener('keyup', checkCreateUserInputFields);
  document.addEventListener('mouseup', checkCreateUserInputFields);
});

const cancelCreateUserButton = document.getElementById('create-user-cancel-button');
cancelCreateUserButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkCreateUserInputFields);
  document.removeEventListener('mouseup', checkCreateUserInputFields);
})

const createUserButton = document.getElementById('create-user-button');
createUserButton.addEventListener('click', createUser);
createUserButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkCreateUserInputFields);
  document.removeEventListener('mouseup', checkCreateUserInputFields);
});

// save button
const editUserButton = document.getElementById('save-user-button');
editUserButton.addEventListener('click', editUser);
editUserButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkEditUserInputFields);
  document.removeEventListener('mouseup', checkEditUserInputFields);
  sessionStorage.removeItem('selectedUserID');
  sessionStorage.removeItem('selectedUser');
});

const cancelEditUserButton = document.getElementById('edit-user-cancel-button');
cancelEditUserButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkEditUserInputFields);
  document.removeEventListener('mouseup', checkEditUserInputFields);
  sessionStorage.removeItem('selectedUserID');
  sessionStorage.removeItem('selectedUser');
});

const deleteUserButton = document.getElementById('delete-user-button');
deleteUserButton.addEventListener('click', deleteUser);

// -------------------- ROOM MODAL BUTTONS -------------------- //
// add room modal popup
const addRoomButton = document.getElementById('add-room-button');
addRoomButton.addEventListener('click', checkCreateRoomInputFields);
addRoomButton.addEventListener('click', () => {
  document.addEventListener('keyup', checkCreateRoomInputFields);
});

const cancelCreateRoomButton = document.getElementById('create-room-cancel-button');
cancelCreateRoomButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkCreateRoomInputFields);
})

const createRoomButton = document.getElementById('create-room-button');
createRoomButton.addEventListener('click', createRoom);
createRoomButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkCreateRoomInputFields);
});
// createRoomButton.addEventListener('click', renderRoomCards); 

const cancelEditRoomButton = document.getElementById('edit-room-cancel-button');
cancelEditRoomButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkEditRoomInputFields);
  sessionStorage.removeItem('room');
});

const editRoomButton = document.getElementById('edit-room-button');
editRoomButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkEditRoomInputFields);
  editRoom();
  sessionStorage.removeItem('room');
});


const saveRoomButton = document.getElementById('edit-room-button');
saveRoomButton.addEventListener('click', checkEditRoomInputFields);

const deleteRoomButton = document.getElementById('delete-room-button');
deleteRoomButton.addEventListener('click', deleteRoom);

// -------------------- ROOM GENERATION FUNCTIONS -------------------- //
// Visually create and append each room card to the room settings list
async function renderRooms() {
  // Reset current list
  resetRoomList();

  // Get list of the rooms
  const rooms = await proxy.getRooms();
  // console.log(rooms);

  // Create user cards for user settings modal
  rooms.forEach(room => {
    const roomListGroupItem = document.createElement('li');
    const roomName = document.createElement('div');
    const icons = document.createElement('div');
    const edit = document.createElement('i');
    const trash = document.createElement('i');

    roomListGroupItem.setAttribute('class', 'list-group-item justify-content-between d-flex align-items-center');

    // Set room text content
    roomName.textContent = room['name'];

    // set icon classes, type, and id
    edit.setAttribute('class', 'fa-solid fa-pen-to-square btn btn-outline-dark m-2');
    edit.setAttribute('data-bs-target', '#rooms-modal-edit');
    edit.setAttribute('data-bs-toggle', 'modal');

    trash.setAttribute('class', 'fa-solid fa-trash btn btn-outline-danger m-2');
    trash.setAttribute('data-bs-target', '#rooms-modal-delete');
    trash.setAttribute('data-bs-toggle', 'modal');

    roomListGroup.append(roomListGroupItem);
    roomListGroupItem.append(roomName);
    roomListGroupItem.append(icons);
    icons.append(edit);
    icons.append(trash);

    edit.addEventListener('click', () => {
      const roomStr = JSON.stringify(room);
      sessionStorage.setItem('room', roomStr);
      const editedRoom = document.getElementById('room-edit-modal-title');
      editedRoom.textContent = `Editing: ${room['name']}`;
      document.addEventListener('keyup', checkEditRoomInputFields);
      setRoomEditPlaceholderValues(room);
      checkEditRoomInputFields();
    });

    trash.addEventListener('click', () => {
      sessionStorage.setItem('roomID', room['id']);
      const deletedRoom = document.getElementById('room-delete-text');
      deletedRoom.textContent = `${room['name']}`;
    });
  });
}

// Reset the list of rooms to be rendered
function resetRoomList() {
  while(roomListGroup.firstChild) {
    roomListGroup.removeChild(roomListGroup.lastChild);
  }
}

// -------------------- Create Room -------------------- //
// Create room inside database
async function createRoom() {
  const room = getCreateRoomObject();

  // Convert greenhouse id to an int from a string
  // room['greenhouse_id'] = parseInt(room['greenhouse_id']);

  await proxy.createRoom(room);
  resetCreateRoomInputFields();
  renderRooms();
  renderRoomCards();
}

function isCreateRoomInputFieldsEmpty(room) {
  const emptyFieldsCreateRoomText = document.getElementById('room-create-invalid-text');

  // loop through returned object to check for empty string
  for (const key in room) {
    if (room[key] == "") {
      emptyFieldsCreateRoomText.style.visibility = 'visible';
      return true;
    }
  }
  emptyFieldsCreateRoomText.style.visibility = 'hidden';
  return false;
}

// Ensure create room inputs are not empty
function checkCreateRoomInputFields() {
  const room = getCreateRoomObject();
  
  if (isCreateRoomInputFieldsEmpty(room)) {
    createRoomButton.disabled = true;
  }else{
    createRoomButton.disabled = false;
  }
}

// Returns the values of each input tag for create room as an object
function getCreateRoomObject() {
  const greenhouseID = document.getElementById('create-greenhouse-id');
  const name = document.getElementById('create-room-name');

  const room = {
    "greenhouse_id": 1, // Disabled input for now
    "name": name.value
  }

  return room;
}

// Sets the values of the create room input fields to empty string
function resetCreateRoomInputFields() {
  // const greenhouseID = document.getElementById('create-greenhouse-id');
  const name = document.getElementById('create-room-name');

  // greenhouseID.value = "";
  name.value = "";
}

// -------------------- Edit Room -------------------- //
function setRoomEditPlaceholderValues(prevRoom) {
  const name = document.getElementById('edit-room-name');
  name.setAttribute('placeholder', prevRoom['name']);
}

function populateEditEmptyFields() {
  const prevRoomStr = sessionStorage.getItem('room');
  const prevRoom = JSON.parse(prevRoomStr);

  const currentRoom = getEditRoomObject();
  console.log(currentRoom);
  console.log(prevRoom);
  if (currentRoom['name'] == '') {
    console.log
    currentRoom['name'] == prevRoom['name'];
  }
  console.log(currentRoom);

  return currentRoom;
}

function getEditRoomObject() {
  const name = document.getElementById('edit-room-name');

  const room = {
    "name": name.value
  }

  return room;
}

// function isEditRoomInputFieldsEmpty(room) {
//   const roomNameEmptyText = document.getElementById('room-edit-invalid-text');

//   if (room['name'] == '') {
//     roomNameEmptyText.style.visibility = 'visible';
//     return true;
//   }
//   roomNameEmptyText.style.visibility = 'hidden';
//   return false;
// }

function isEditRoomNameTooLong(name) {
  const invalidNameLengthText = document.getElementById('room-edit-invalid-name-length-text');

  if (name.length > Utils.MAX_NAME_LENGTH) {
    invalidNameLengthText.style.visibility = 'visible';
    return true;
  }
  invalidNameLengthText.style.visibility = 'hidden';
  return false;
}

function checkEditRoomInputFields() {
  const room = getEditRoomObject();

  // const isEmpty = isEditRoomInputFieldsEmpty(room);
  const isTooLong = isEditRoomNameTooLong(room['name']);

  if (!isTooLong) {
    editRoomButton.disabled = false;
  }else{
    editRoomButton.disabled = true;
  }
}

function resetEditRoomInputFields() {
  const name = document.getElementById('edit-room-name');
  name.value = '';  
}

async function editRoom() {
  const room = populateEditEmptyFields();
  const roomStr = sessionStorage.getItem('room')
  const roomID = JSON.parse(roomStr)['id'];
  

  console.log(room);
  console.log(roomID);
  await proxy.editRoom(roomID, room);
  resetEditRoomInputFields();
  renderRooms();
  renderRoomCards();
}

// -------------------- Delete Room -------------------- //
// Delete room from database
async function deleteRoom() {
  const roomID = sessionStorage.getItem('roomID');
  sessionStorage.removeItem('roomID');

  await proxy.deleteRoom(roomID);
  renderRooms();
  renderRoomCards();
}

