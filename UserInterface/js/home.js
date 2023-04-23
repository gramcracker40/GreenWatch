import { GreenhouseProxy } from "../api/api.js";

const proxy = new GreenhouseProxy();
const room_grid = document.getElementById('room-grid');
const main = document.createElement('main');
room_grid.append(main);

async function renderRooms() {
  const rooms = await proxy.getRooms();
  // console.log(rooms);

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.

  if (rooms.length) {
    rooms.forEach(room => {
      const card = document.createElement('div');
      const card_header = document.createElement('div');
      const card_body = document.createElement('div');    // Needs to containt multiple rows
      const roomName = document.createElement('h1');
  
      // Need a label, value, and row for each
      const t_row = document.createElement('div');
      const t_label = document.createElement('p');
      const t_value = document.createElement('p');
      const h_row = document.createElement('div');
      const h_label = document.createElement('p');
      const h_value = document.createElement('p');
      const p_row = document.createElement('div');
      const p_label = document.createElement('p');
      const p_value = document.createElement('p');
      const l_row = document.createElement('div');
      const l_label = document.createElement('p');
      const l_value = document.createElement('p');
  
      card.setAttribute('class', 'room-card');
      card.setAttribute('id', `${room['id']}`)
      card_header.setAttribute('class', 'card-header');
      card_body.setAttribute('class', 'row');
      roomName.setAttribute('class', 'display-3')
      roomName.textContent = room["name"];
      
      t_row.setAttribute('class', 'd-flex justify-content-between');
      t_label.setAttribute('class', 'h1');
      t_label.textContent = "Temperature:";
      t_value.setAttribute('class', 'h1');
      t_value.textContent = `${room['measurements'][0]['temperature']}`;
      h_row.setAttribute('class', 'd-flex justify-content-between');
      h_label.setAttribute('class', 'h1');
      h_label.textContent = "Humidity:";
      h_value.setAttribute('class', 'h1');
      h_value.textContent = `${room['measurements'][0]['humidity']}`;
      p_row.setAttribute('class', 'd-flex justify-content-between');
      p_label.setAttribute('class', 'h1');
      p_label.textContent = "Pressure:";
      p_value.setAttribute('class', 'h1');
      p_value.textContent = `${room['measurements'][0]['pressure']}`;
      l_label.setAttribute('class', 'h1');
      l_label.textContent = "Light:";
      l_row.setAttribute('class', 'd-flex justify-content-between');
      l_value.setAttribute('class', 'h1');
      l_value.textContent = `${room['measurements'][0]['light']}`;
  
      t_row.append(t_label);
      t_row.append(t_value);
      h_row.append(h_label);
      h_row.append(h_value);
      p_row.append(p_label);
      p_row.append(p_value);
      l_row.append(l_label);
      l_row.append(l_value);
      card_body.append(t_row);
      card_body.append(h_row);
      card_body.append(p_row);
      card_body.append(l_row);
      card_header.append(roomName);
      card.append(card_header);
      card.append(card_body);
      main.append(card);
    
      card.addEventListener('click', () => {
        // console.log(card.getAttribute('id'));
        window.location.href = "./roompage.html";
      });
    });
  }else{
    const noRoomsText = document.createElement('div');
    noRoomsText.setAttribute('class', '');
    noRoomsText.textContent = "There are currently no rooms. Create a room to have it be displayed here.";
    main.append(noRoomsText);
  }

  

  // displayNewRoomCard(main);
}

function renderNewRoomCard() {
  const body = document.body;
  const main = document.createElement('main');
  body.append(main);

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.

  // Create an array to keep track of references for each card created

  const card = document.createElement('div');
  // const plusIcon = document.createElement('img');
  // const title = document.createElement('h2');
  const button = document.createElement('button');
  button.setAttribute('class', 'modal-trigger');
  card.setAttribute('class', 'plus-card');
  // plusIcon.setAttribute('src', 'images/plus.png');
  // plusIcon.setAttribute('width', '50px');
  // title.textContent = "add new room";
  button.textContent = "create room";

  // card.append(plusIcon);
  card.append(button);
  main.append(card);
}

renderRooms();
// renderNewRoomCard();