function updateRoomData() {

  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(user)
  // }

  fetch('http://192.168.1.94:5000/rooms')
  .then((res) => res.json())
  .then((data) => addRoomCards(data)
  );
}

// updateRoomData();



function addRoomCards(roomData) {
  console.log(roomData);

  const body = document.body;
  const main = document.createElement('main');
  body.append(main);

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.

  const rooms = ["room1", "room2", "room3"]

  roomData.forEach(room => {
    const card = document.createElement('div');
    const roomName = document.createElement('h2');
    const measurements = document.createElement('p');
    card.setAttribute('class', 'card');
    roomName.textContent = room["name"];
    measurements.textContent = room["measurements"][0]["temperature"];
    card.append(roomName);
    card.append(measurements);
    main.append(card);
  });
}

function displayNewRoomCard() {
  const body = document.body;
  const main = document.createElement('main');
  body.append(main);

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.

  // Create an array to keep track of references for each card created

  const clickable = document.createElement('a');
  const card = document.createElement('div');
  const plusIcon = document.createElement('img');
  const title = document.createElement('h2');
  card.setAttribute('class', 'plus-card');
  plusIcon.setAttribute('src', 'images/plus.png');
  plusIcon.setAttribute('width', '50px');
  title.textContent = "add new room";

  card.append(plusIcon);
  card.append(title);
  clickable.append(card);
  main.append(card);
}

// updateRoomData();
displayNewRoomCard();

$(document).ready(function() {
  $("#room1").clickable(function() {
    window.location.href = "roompage.html";
  });
});