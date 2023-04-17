// import { GreenhouseProxy } from "../api/api.js";

// const proxy = new GreenhouseProxy();

// const rooms = proxy.listRooms();
// console.log(rooms);
// console.log(typeof(rooms));

function generateDropdownItems() {
  fetch('http://127.0.0.1:5000/rooms')
  .then((res) => res.json())
  .then((data) => {
      // console.log(data);
      data.forEach(room => {

        // // Item based on dropdown
        // const item = document.createElement('li');
        // item.setAttribute('class', 'dropdown-item');
        // item.setAttribute('id', `${room['id']}`);
        // item.textContent = `${room["name"]}`;
        // document.getElementById('chatbox-dropdown').append(item);

        // Item based on control selector
        const option = document.createElement('option');
        option.setAttribute('value', `${room['id']}`);
        option.textContent = `${room['name']}`;
        document.getElementById('chatbox-dropdown').append(option);
      });
  });
}

generateDropdownItems();