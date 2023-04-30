import { GreenhouseProxy } from "../api/api.js";

const proxy = new GreenhouseProxy();

const roomID = sessionStorage.getItem('roomID');

async function setRoomName() {
  const room = await proxy.getRoomByID(roomID);
  const roomName = room['name'];
  const roomNameText = document.getElementById('room-name-text');

  roomNameText.textContent = roomName;
}

setRoomName();
