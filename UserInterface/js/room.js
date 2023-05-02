import { GreenhouseProxy } from "../api/api.js";
import * as Utils from "../js/utilities.js";

const proxy = new GreenhouseProxy();

const roomID = sessionStorage.getItem('roomID');

async function setRoomName() {
  const room = await proxy.getRoomByID(roomID);
  const roomName = room['name'];
  const roomNameText = document.getElementById('room-name-text');

  roomNameText.textContent = roomName;
}

setRoomName();

const logoutLink = document.getElementById('logout-link');
logoutLink.addEventListener('click', Utils.logout);
