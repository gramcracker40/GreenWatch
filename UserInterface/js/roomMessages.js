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

function resetChatbox() {
  while(chatbox_body.firstChild) {
    chatbox_body.removeChild(chatbox_body.lastChild);
  }
}

async function renderMessages() {
  const messages = await proxy.getAllMessagesByRoom(roomID);
  // console.log(messages);
  resetChatbox();

  if (messages.length) {
    messages.forEach(message => {
      const textContainer = document.createElement('div');
      textContainer.setAttribute('class', 'd-flex align-items-baseline mb-4');
      const container2 = document.createElement('div');
      container2.setAttribute('class', 'pe-2');
      const textCard = document.createElement('div');
      textCard.setAttribute('class', 'card card-text d-inline-block p-2 px-3 m-1');
      // const info = document.createElement('div');
      // info.setAttribute('class', 'd-flex');
      const user = document.createElement('div');
      user.setAttribute('class', 'small');
      user.textContent = usernames[message['user_id']];
      const date = document.createElement('div');
      date.setAttribute('class', 'small');

      const dateObj = new Date(message['timestamp']);
      const day = dateObj.getDate();
      const month = Utils.months[dateObj.getMonth()];
      const year = dateObj.getFullYear();
      const hoursObj = Utils.toStandardTime(dateObj.getHours());
      let minutes = dateObj.getMinutes();
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      const hours = hoursObj['hours'];
      const amPm = hoursObj['amPm'];
      const dateStr = `${hours}:${minutes} ${amPm} - ${day} ${month}, ${year}`;

      date.textContent = dateStr;

      textCard.textContent = message["body"];

      container2.append(user);
      container2.append(textCard);
      container2.append(date);
      // info.append(user);
      // info.append(date);

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

  // Get user ID from access_token
  const jwt = Utils.getJwt();
  const userID = jwt['user_id'];

  await proxy.createRoomMessage(roomID, userID, message);
  renderMessages();

  messageBox.value = '';
}