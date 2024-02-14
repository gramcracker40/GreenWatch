import { GreenhouseProxy } from "../api/api.js";
import * as Utils from "../js/utilities.js";

const proxy = new GreenhouseProxy();

const roomID = sessionStorage.getItem('roomID');

const createAgentBtn = document.getElementById('create-agent');
createAgentBtn.addEventListener('click', createAgent);

async function setRoomName() {
  const room = await proxy.getRoomByID(roomID);
  const roomName = room['name'];
  const roomNameText = document.getElementById('room-name-text');

  roomNameText.setAttribute('style', 'color: grey');

  // Get agent 
  // const agent = await proxy.getAgentByID(room['id'])
  const agents = await proxy.getAgents();
  let agent_ip = " [...]";
    agents.forEach(agent => {
      if (roomID == agent['room_id'])
        {
          agent_ip = ` [${agent['ip_address']}]`;
          roomNameText.setAttribute('style', 'color: black');
        }
    })

  roomNameText.textContent = roomName + agent_ip;

}

setRoomName();

const logoutLink = document.getElementById('logout-link');
logoutLink.addEventListener('click', Utils.logout);

async function createAgent() {
  console.log("Creating new agent for room: " + roomID)
  const message = "[LOG] Creating new agent for room: " + roomID

  // Get user ID from access_token
  const jwt = Utils.getJwt();
  const userID = jwt['user_id'];

  const agentObj = getCreateAgentObject();
  // Create agent in database
  await proxy.createAgent(agentObj);

  // Post message in notes
  await proxy.createRoomMessage(roomID, userID, message);
  console.log("[SUCCESS] Created new agent for room: " + roomID)

  redirectToDownloadAgent() 

}

function getCreateAgentObject() {

  const agent = {
    "duration": "00:00:23.000000",
    "ip_address": "127.0.0.1",
    "room_id": roomID,
    "server_id": 1
  }

  return agent;
}

// Function to redirect to a relative URL
function redirectToDownloadAgent() 
{
  // Relative URL to redirect to
  const relativeURL = 
'http://127.0.0.1:5000/servers/agents/' + roomID;

  // Construct absolute URL based 
  // on the current location
  const absoluteURL = 
  new URL(relativeURL);
  // new URL(relativeURL, window.location.href);

  // const absoluteURL = '127.0.0.1/servers/agents/' + roomID;

  // Log the absolute URL (optional)
  console.log('Redirecting to:', absoluteURL.href);

  // Redirect to the absolute URL
  window.location.href = absoluteURL.href;
}