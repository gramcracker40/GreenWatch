import { GreenhouseProxy } from "../api/api.js";
import * as Utils from "../js/utilities.js";

const proxy = new GreenhouseProxy();

/* Dark Mode Logic */
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
  const darkModeSwitch = document.getElementById('darkModeSwitch');

  // Check if the user has a preference stored in localStorage
  const isDarkMode = localStorage.getItem('darkMode') === "true";

  // Apply the stored preference
  darkModeSwitch.checked = isDarkMode;
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }

  // Listen for changes to the toggle switch
  darkModeSwitch.addEventListener('change', () => {
    if (darkModeSwitch.checked) {
      // Activate dark mode and store the preference
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', "true");
    } else {
      // Deactivate dark mode and store the preference
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', "false");
    }
  });
});

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

function resetDropdownItems() {
  while (chatbox_dropdown.firstChild) {
    chatbox_dropdown.removeChild(chatbox_dropdown.lastChild);
  }
}

export async function generateDropdownItems() {
  resetDropdownItems();
  const rooms = await proxy.getRooms();
  
  // console.log(rooms);

  // Check if there are any rooms
  // If not, then don't generate the dropdown menu
  if (rooms.length) {
    // console.log("There are no rooms...");
    const defaultOption = document.createElement('option')
    defaultOption.setAttribute('selected', 'selected');
    defaultOption.setAttribute('disabled', 'disabled');
    defaultOption.setAttribute('hidden', 'hidden');
    defaultOption.value = "";
    defaultOption.textContent = "Select Room";
    chatbox_dropdown.append(defaultOption);

    rooms.forEach(room => {

      // Item based on bootstrap dropdown
      // const item = document.createElement('li');
      // item.setAttribute('class', 'dropdown-item');
      // item.setAttribute('id', `${room['id']}`);
      // item.textContent = `${room["name"]}`;
      // document.getElementById('dropdown-menu').append(item);
  
      // Item based on html option selector
      const option = document.createElement('option');
      option.setAttribute('value', `${room['id']}`);
      option.textContent = `${room['name']}`;
      chatbox_dropdown.append(option);
    });
  }else{
    const defaultOption = document.createElement('option')
    defaultOption.setAttribute('selected', 'selected');
    defaultOption.setAttribute('disabled', 'disabled');
    defaultOption.setAttribute('hidden', 'hidden');
    defaultOption.value = "";
    defaultOption.textContent = "No Rooms Exist";
    chatbox_dropdown.append(defaultOption);
    chatbox_dropdown.setAttribute('disabled', 'disabled');
  }
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
  resetChatbox();

  if (roomID != "") {
    const messages = await proxy.getAllMessagesByRoom(roomID);
    if (messages.length) {
      messages.forEach(message => {
        // const user = message["user_id"];
        const textContainer = document.createElement('div');
        textContainer.setAttribute('class', 'd-flex align-items-baseline mb-4');
        const container2 = document.createElement('div');
        container2.setAttribute('class', 'pe-2');
        const textCard = document.createElement('div');
        textCard.setAttribute('class', 'card card-text d-inline-block p-2 px-3 m-1');
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

        textContainer.append(container2);
        
        chatbox_body.append(textContainer);
      });
    }else{
      const emptyMessagesText = document.createElement('div');
      emptyMessagesText.textContent = "No Messages Available";
      emptyMessagesText.setAttribute('style', 'color: grey');
      chatbox_body.append(emptyMessagesText);
    }
    
    // console.log(messages);
  }else{
    const emptyMessagesText = document.createElement('div');
    emptyMessagesText.textContent = "No Messages Available";
    emptyMessagesText.setAttribute('style', 'color: grey');
    chatbox_body.append(emptyMessagesText);
  }
}

renderMessages();
chatbox_dropdown.addEventListener("click", renderMessages);