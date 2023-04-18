import { GreenhouseProxy } from "../api/api.js";

const proxy = new GreenhouseProxy();
const room_grid = document.getElementById('room-grid');
const main = document.createElement('main');
room_grid.append(main);

async function renderRooms() {
  const rooms = await proxy.listRooms();
  console.log(rooms);

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.

  rooms.forEach(room => {
    const card = document.createElement('div');
    const card_header = document.createElement('div');
    const card_body = document.createElement('div');    // Needs to containt multiple rows
    const roomName = document.createElement('h1');

    // Need a label, value, and row for each
    const t_measurement = document.createElement('p');
    const h_measurement = document.createElement('p');
    const p_measurement = document.createElement('p');
    const l_measurement = document.createElement('p');

    card.setAttribute('class', 'room-card');
    card_body.setAttribute('class', 'row');
    roomName.setAttribute('class', 'display-3')
    roomName.textContent = room["name"];
    t_measurement.setAttribute('class', 'h1');
    t_measurement.textContent = room['measurements'][0]['temperature'];
    h_measurement.setAttribute('class', 'h1');
    h_measurement.textContent = room['measurements'][0]['humidity'];
    p_measurement.setAttribute('class', 'h1');
    p_measurement.textContent = room['measurements'][0]['pressure'];
    l_measurement.setAttribute('class', 'h1');
    l_measurement.textContent = room['measurements'][0]['light'];

    card_header.append(roomName);
    card_body.append(t_measurement);
    card_body.append(h_measurement);
    card_body.append(p_measurement);
    card_body.append(l_measurement);
    card.append(card_header);
    card.append(card_body);
    main.append(card);
  
  });

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

// document.addEventListener('click', e => {
//   if (e.target.matches("div")) {
//     console.log("added room");
//   }
// });

