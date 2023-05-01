import { GreenhouseProxy } from "../api/api.js";
import * as Utils from "../js/utilities.js";

const proxy = new GreenhouseProxy();

const roomID = sessionStorage.getItem('roomID');
const chatbox_body = document.getElementById('chat-box-body');
const users = await proxy.getUsers();
let usernames = {};

const sendMessageBtn = document.getElementById('send-message-btn');
sendMessageBtn.addEventListener('click', sendMessage);

function createUserList() {
  users.forEach(user => {
    usernames[user['id']] = user['first_name'];
  });
}

createUserList();
// console.log(usernames);

function resetChatbox() {
  while(chatbox_body.firstChild) {
    chatbox_body.removeChild(chatbox_body.lastChild);
  }
}

async function renderMessages() {
  const messages = proxy.getAllMessagesByRoom(roomID);
  console.log(messages);
  resetChatbox();

  if (messages.length) {
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
  }else{
    const emptyMessagesText = document.createElement('div');
    emptyMessagesText.textContent = "No Messages Available";
    emptyMessagesText.setAttribute('style', 'color: grey');
    chatbox_body.append(emptyMessagesText);
  }
}

renderMessages();

async function sendMessage() {
  const messageBox = document.getElementById('message-input-box');
  const message = messageBox.value;
  console.log(message);

  // Get user ID from access_token
  Utils.
}