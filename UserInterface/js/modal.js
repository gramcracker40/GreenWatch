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
  isAdmin.value = "";
  firstName.value = "";
  lastName.value = "";
  email.value = "";
}

function isStrongPassword(password) {
  const passwordParamText = document.getElementById('user-create-invalid-password-text');
  const strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');

  if (!strongPassword.test(password)) {
    passwordParamText.style.visibility = 'visible';
    return false;
  }
  passwordParamText.style.visibility = 'hidden';
  return true;
}

function isFieldsEmpty(user) {
  const emptyFieldsText = document.getElementById('user-create-invalid-text');

  for (const key in user) {
    if (user[key] == "") {
      emptyFieldsText.style.visibility = 'visible';
      return true;
    }
  }
  emptyFieldsText.style.visibility = 'hidden';
  return false;
}

function checkCreateInputFields() {
  const user = getCreateUserObject();

  // Storing in variables so both functions run 
  // instead of accidentally short circuiting the other 
  // within if statement below.
  const fieldsEmpty = isFieldsEmpty(user);
  const strongPassword = isStrongPassword(user['password']);
  
  // Check if inputfields are empty and if the password is strong.
  // If both are true, then allow for the creation of the user.
  if (!fieldsEmpty && strongPassword) {
    createUserButton.disabled = false;
  }else{
    createUserButton.disabled = true;
  }
}

function resetCreateInputFields() {
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
  // const userCreateModal = document.getElementById('users-modal-create-footer');
  const user = getCreateUserObject();

  // Convert admin status to boolean after checking for empty fields.
  user['is_admin'] = Boolean(user['is_admin']); 

  await proxy.registerUser(user);
  resetCreateInputFields();
  renderUsers();
}

async function deleteUser() {
  const userID = sessionStorage.getItem('userID');
  sessionStorage.removeItem('userID');

  proxy.deleteUser(userID);
}

// Event Listeners for user modal buttons
// save button
const saveUserButton = document.getElementById('save-user-button');
saveUserButton.addEventListener('click', editUser);

// add user modal popup
const addUserButton = document.getElementById('add-user-button');
addUserButton.addEventListener('click', checkCreateInputFields);
addUserButton.addEventListener('click', () => {
  document.addEventListener('keyup', checkCreateInputFields);
  document.addEventListener('mouseup', checkCreateInputFields);
});

const cancelCreateUserButton = document.getElementById('create-user-cancel-button');
cancelCreateUserButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkCreateInputFields);
  document.removeEventListener('mouseup', checkCreateInputFields);
})

const createUserButton = document.getElementById('create-user-button');
createUserButton.addEventListener('click', createUser);
createUserButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkCreateInputFields);
  document.removeEventListener('mouseup', checkCreateInputFields);
});

const deleteUserButton = document.getElementById('delete-user-button');
deleteUserButton.addEventListener('click', deleteUser);

const saveRoomButton = document.getElementById('save-user-button');
saveRoomButton.addEventListener('click', editUser);

// Event Listeners for user modal buttons
// add user modal popup
const addRoomButton = document.getElementById('add-room-button');
addRoomButton.addEventListener('click', checkCreateInputFields);
addRoomButton.addEventListener('click', () => {
  document.addEventListener('keyup', checkCreateInputFields);
  document.addEventListener('mouseup', checkCreateInputFields);
});

const cancelCreateRoomButton = document.getElementById('create-room-cancel-button');
cancelCreateRoomButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkCreateInputFields);
  document.removeEventListener('mouseup', checkCreateInputFields);
})

const createRoomButton = document.getElementById('create-room-button');
createRoomButton.addEventListener('click', createUser);
createRoomButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkCreateInputFields);
  document.removeEventListener('mouseup', checkCreateInputFields);
});

const deleteRoomButton = document.getElementById('delete-room-button');
deleteRoomButton.addEventListener('click', deleteUser);

function resetRoomList() {
  while(roomListGroup.firstChild) {
    roomListGroup.removeChild(roomListGroup.lastChild);
  }
}

async function renderRooms() {
  // Reset current list
  resetRoomList();

  // Get list of users
  const rooms = await proxy.getRooms();
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