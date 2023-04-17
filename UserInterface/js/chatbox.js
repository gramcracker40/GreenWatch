// import { GreenhouseProxy } from "../api/api.js";

// const proxy = new GreenhouseProxy();

// const rooms = proxy.listRooms();
// console.log(rooms);
// console.log(typeof(rooms));

const chatbox_dropdown = document.getElementById('chatbox-dropdown');
const chatbox_body = document.getElementById('chat-box-body');

function generateDropdownItems() {
  fetch('http://127.0.0.1:5000/rooms')
  .then((res) => res.json())
  .then((data) => {
      // console.log(data);
      data.forEach(room => {

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
  });
}

function getAllMessagesByRoom(roomID) {
  const options = {
      headers: {
          'Content-Type': 'application/json'
      }
  }

  fetch(`${url}/rooms/${roomID}/messages`, options)
  .then((res) => res.json())
  // .then((data) => );
}

function resetChatbox() {
  while(chatbox_body.firstChild) {
    chatbox_body.removeChild(chatbox_body.lastChild);
  }
}

generateDropdownItems();

chatbox_dropdown.addEventListener("click", e => {
  // const messages = getAllMessagesByRoom(e.target.value);

  const roomID = e.target.value;

  const options = {
    headers: {
        'Content-Type': 'application/json'
    }
  }

  fetch(`${url}/rooms/${roomID}/messages`, options)
  .then((res) => res.json())
  .then((data) => {
    resetChatbox();
    data.forEach(message => {
      // const emptyDiv = documnet.createElement('div');
      const textContainer = document.createElement('div');
      textContainer.setAttribute('class', 'd-flex align-items-baseline mb-4');
      const container2 = document.createElement('div');
      container2.setAttribute('class', 'pe-2');
      const textCard = document.createElement('div');
      textCard.setAttribute('class', 'card card-text d-inline-block p-2 px-3 m-1');
      const date = document.createElement('div');
      date.setAttribute('class', 'small');
      date.textContent = "1:10PM";

      textCard.textContent = message["body"];

      container2.append(textCard);
      container2.append(date);

      textContainer.append(container2);
      
      chatbox_body.append(textContainer);
    });
  });

  // resetChatbox();
  // messages.forEach(message => {
  //   chatbox_body.append(message["body"]);
  // });
  // console.log(messages);
});