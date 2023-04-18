// TODO: Have "no messages..." displayed when there are no messages in the room
// Could be a simple check in the renderRooms function

import { GreenhouseProxy } from "../api/api.js";

const proxy = new GreenhouseProxy();

const chatbox_dropdown = document.getElementById('chatbox-dropdown');
const chatbox_body = document.getElementById('chat-box-body');
const users = await proxy.getUsers();
let usernames = {};
// console.log(users);

function createUserList() {
  users.forEach(user => {
    usernames[user['id']] = user['first_name'];
  });
}

createUserList();
// console.log(usernames);

async function generateDropdownItems() {
  const rooms = await proxy.listRooms();

  rooms.forEach(room => {

    // // Item based on bootstrap dropdown
    // const item = document.createElement('li');
    // item.setAttribute('class', 'dropdown-item');
    // item.setAttribute('id', `${room['id']}`);
    // item.textContent = `${room["name"]}`;
    // document.getElementById('chatbox-dropdown').append(item);

    // Item based on html option selector
    const option = document.createElement('option');
    option.setAttribute('value', `${room['id']}`);
    option.textContent = `${room['name']}`;
    chatbox_dropdown.append(option);
  });
}

function resetChatbox() {
  while(chatbox_body.firstChild) {
    chatbox_body.removeChild(chatbox_body.lastChild);
  }
}

generateDropdownItems();

async function renderMessages() {
    // console.log(chatbox_dropdown.value);
    const roomID = chatbox_dropdown.value;

    const messages = await proxy.getAllMessagesByRoom(roomID);

    resetChatbox();
    messages.forEach(message => {
      const user = message["user_id"];
      const textContainer = document.createElement('div');
      textContainer.setAttribute('class', 'd-flex align-items-baseline mb-4');
      const container2 = document.createElement('div');
      container2.setAttribute('class', 'pe-2');
      const textCard = document.createElement('div');
      textCard.setAttribute('class', 'card card-text d-inline-block p-2 px-3 m-1');
      const date = document.createElement('div');
      date.setAttribute('class', 'small');
      date.textContent = usernames[message['user_id']];

      textCard.textContent = message["body"];

      container2.append(textCard);
      container2.append(date);

      textContainer.append(container2);
      
      chatbox_body.append(textContainer);
    });
    // console.log(messages);
}

// renderMessages();
chatbox_dropdown.addEventListener("click", renderMessages);