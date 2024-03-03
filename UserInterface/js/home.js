import { GreenhouseProxy } from "../api/api.js";
import * as Utils from "../js/utilities.js";

const proxy = new GreenhouseProxy();
const room_grid = document.getElementById('room-grid');
const main = document.createElement('main');
room_grid.append(main);

// Function: hideSettings()
// Hides the settings if use isn't an admin
function hideSettings() {
  const jwt = Utils.getJwt();
  const token = Utils.parseJwt(JSON.stringify(jwt));

  const settingsDropstart = document.getElementById('settings-dropstart');
  if (token['admin']) {
    settingsDropstart.style.visibility = "visible";
  }else{
    settingsDropstart.style.visibility = "hidden";
  }
}
//Calling hideSettings functions
hideSettings();

//Grabs the logout-link anchor tag 
const logoutLink = document.getElementById('logout-link');
//when clicked use logout method from Utils
logoutLink.addEventListener('click', Utils.logout); 

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
      localStorage.setItem('darkMode', 'true');
    } else {
      // Deactivate dark mode and store the preference
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
    renderRoomCards();
  });
});


function resetRoomsList() {
  while(main.firstChild) {
    main.removeChild(main.lastChild);
  }
}

export async function renderRoomCards(intervalId) {
  resetRoomsList();

  const rooms = await proxy.getRooms();
  const agents = await proxy.getAgents();

  const isDarkMode = localStorage.getItem('darkMode');
  // console.log(`[DARK MODE] ${isDarkMode}`)

  const vent_states = ['Open', 'Closed', 'Pending']
  const shade_states = ['Open', 'Closed', 'Pending']

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.
  if (rooms.length) {
    rooms.forEach(room => {
      const room_id = room['id'];
      const card = document.createElement('div'); 
      const card_header = document.createElement('div');
      const roomAlive = document.createElement('button');
      const card_body = document.createElement('div');    // Needs to containt multiple rows
      const roomName = document.createElement('h2');
      
      card.setAttribute('class', 'room-card');
      card.setAttribute('id', `${room_id}`);

      try{
        if (agents[room_id-1]['status'] == 1){
          roomAlive.setAttribute('class', 'btn btn-primary alive-button-on');
        } else {
          roomAlive.setAttribute('class', 'btn btn-primary alive-button-pending');
        }
      } catch (error) {
        console.log("Room " + room_id + " " + error.message);
        roomAlive.setAttribute('class', 'btn btn-primary alive-button-off');
      }
        
      
      roomAlive.innerHTML = Utils.powerButton;
      // roomAlive.setAttribute('class','alive-button');
      roomAlive.setAttribute('id',`alive-button${room_id}`);
      
      try{
        toggleRoomAlive(roomAlive, room_id, intervalId);
      } catch (error) {
        console.log("Room " + room_id + " " + error.message);
      }
      
      roomAlive.addEventListener('click', async function(event) {
        // Prevent the event from propagating to the card
        event.stopPropagation();
        roomAlive.classList.remove('alive-button-on');
        roomAlive.classList.remove('alive-button-off');
        roomAlive.classList.remove('alive-button-pending');
        roomAlive.classList.remove('alive-button-pending-green');

        try {
          if (agents[room_id-1]['status'] == 1){
            roomAlive.classList.add('alive-button-pending-green');
          } else {
            roomAlive.classList.add('alive-button-pending');
          }  
          toggleRoomAlive(roomAlive, room_id, intervalId);
        } catch (error){
          console.log("Room " + room_id + " " + error.message);
          roomAlive.classList.add('alive-button-pending');
        }
      })
      
      // roomAlive.setAttribute('style', 'color: green');
      card_header.setAttribute('class', 'card-header');
      card_body.setAttribute('class', 'row');
      roomName.setAttribute('class', 'display-3');
      roomName.setAttribute('style', 'color: grey');
            
      // Get agent 
      let agent_ip = " [...]";
        agents.forEach(agent => {
          if (room_id == agent['room_id'])
            {
              agent_ip = ` [${agent['device_ip_address']}]`;
            }
            if (isDarkMode == 'true'){
              roomName.setAttribute('style', 'color: white');
            } else {
              roomName.setAttribute('style', 'color: black');
            }
        })

      roomName.textContent = room["name"] + agent_ip;

      async function getLastAction(room_id){
      // Get last action
      const lastAction = await proxy.getLastActionByRoomID(room_id);
      return lastAction;
      }

      // Main buttons
      // Create a button element
      const m_button_row = document.createElement('div');
      const start_button = document.createElement('button');
      const stop_button = document.createElement('button');
      const download_button = document.createElement('button');

      download_button.setAttribute("class", "btn btn-success");
      download_button.innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"></path>
        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"></path>
      </svg> Data`

      start_button.setAttribute('id', `start_button${room_id}`);
      stop_button.setAttribute('id', `stop_button${room_id}`);
      
      if (isDarkMode == 'true'){
        start_button.setAttribute('class', `btn btn-outline-light`);
        stop_button.setAttribute('class', `btn btn-outline-light`);
      } else {
        start_button.setAttribute('class', `btn btn-outline-dark`);
        stop_button.setAttribute('class', `btn btn-outline-dark`);
      }

      start_button.textContent = "Start Logging";
      // Add an event listener for the click event to refresh the page
      start_button.addEventListener('click', async function(event) {
        // Disable button until action fulfilled
        start_button.disabled = true;
        stop_button.disabled = false;
        
        // Prevent the event from propagating to the card
        event.stopPropagation();

        // Get last action
        const lastAction = await proxy.getLastActionByRoomID(room_id);
        // console.log(lastAction['stop']);

        console.log(`Room ID ${room_id} Acknowledged: ${lastAction['ack']}`);
        
        // Create action object
        const actionObj = getCreateActionObject(
          0,
          0,
          0,
          lastAction['vent_state'],
          lastAction['shade_state'],
          0
          )

        // Get user ID from access_token
        const jwt = Utils.getJwt();
        const userID = jwt['user_id'];

        // Create action in database
        await proxy.createAction(room_id, actionObj);

        // Post message in notes
        const message = `[MEASUREMENT] Started logging in room ${room_id}`; 
        await proxy.createRoomMessage(room_id, userID, message);
        // console.log("[SUCCESS] Started logging in room: " + room_id);
        
        renderRoomValues();
        });

      stop_button.textContent = "Stop Logging";
      // Add an event listener for the click event to refresh the page
      stop_button.addEventListener('click', async function(event) {

        // Disable button until action fulfilled
        start_button.disabled = false;
        stop_button.disabled = true;
        
        // Prevent the event from propagating to the card
        event.stopPropagation();
        
        // Get last action
        const lastAction = await proxy.getLastActionByRoomID(room_id);
        // console.log(lastAction['stop']);

        // Create action object
        const actionObj = getCreateActionObject(
          0,
          0,
          1,
          lastAction['vent_state'],
          lastAction['shade_state'],
          0
          )
      
        // Get user ID from access_token
        const jwt = Utils.getJwt();
        const userID = jwt['user_id'];

        // Create action in database
        await proxy.createAction(room_id, actionObj);

        // Post message in notes
        const message = `[MEASUREMENT] Stopped logging in room ${room_id}`; 
        await proxy.createRoomMessage(room_id, userID, message);
        // console.log("[SUCCESS] Stopped logging in room: " + room_id);

        // Refresh cards
        renderRoomValues();
        });

      download_button.addEventListener('click', async function(event)
        {
          // Prevent the event from propagating to the card
          event.stopPropagation();
          
          redirectToDownloadCSV(server_ip, room_id);
        }
      )

      m_button_row.append(start_button);
      m_button_row.append(stop_button);
      m_button_row.append(download_button);
      card_body.append(m_button_row);
      
      const status_row = document.createElement('div');
      const status_label = document.createElement('p');
      const status_value = document.createElement('p');
      status_row.setAttribute('class', 'd-flex justify-content-between');
      status_label.setAttribute('class', 'h1');
      status_label.textContent = "Logging: ";
      status_value.setAttribute('class', 'h1');
      status_value.setAttribute('id', `status_value${room_id}`);
      status_value.textContent = `...`;
      
      let isStopped = -1;
      getLastAction(room_id).then(response => {
        try{
          isStopped = response['stop'];
        } catch (error) {
          console.log("Room " + room_id + " " + error.message);
          isStopped = 1;
        }
        // console.log(`isStopped: ${isStopped}`)
        if (isStopped == 0){
          start_button.disabled = true;
          stop_button.disabled = false;
          status_value.textContent = " Active " + "(" + agents[room_id-1]['duration'] + ")";
          status_value.setAttribute('style', 'color: green');
        }else{
          start_button.disabled = false;
          stop_button.disabled = true;
          status_value.textContent = " Inactive ";
          status_value.setAttribute('style', 'color: grey');
        }
        // console.log(`stop: ${isStopped}`)
      })
      
      status_row.append(status_label);
      status_row.append(status_value);
      card_body.append(status_row);
      
      if (room['measurements'].length) {
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

        t_row.setAttribute('class', 'd-flex justify-content-between');
        t_label.setAttribute('class', 'h2');
        t_label.textContent = "Temp (°C):";
        t_value.setAttribute('class', 'h2');
        t_value.setAttribute('id', `t_value${room['id']}`)
        t_value.textContent = `${room['measurements'][room['measurements'].length-1]['temperature']}`;
        h_row.setAttribute('class', 'd-flex justify-content-between');
        h_label.setAttribute('class', 'h2');
        h_label.textContent = "Humidity (Rel):";
        h_value.setAttribute('class', 'h2');
        h_value.setAttribute('id', `h_value${room['id']}`)
        h_value.textContent = `${room['measurements'][room['measurements'].length-1]['humidity']}`;
        p_row.setAttribute('class', 'd-flex justify-content-between');
        p_label.setAttribute('class', 'h2');
        p_label.textContent = "Pressure (mBar):";
        p_value.setAttribute('class', 'h2');
        p_value.setAttribute('id', `p_value${room['id']}`)
        p_value.textContent = `${room['measurements'][room['measurements'].length-1]['pressure']}`;
        l_label.setAttribute('class', 'h2');
        l_label.textContent = "Light:";
        l_row.setAttribute('class', 'd-flex justify-content-between');
        l_value.setAttribute('class', 'h2');
        l_value.setAttribute('id', `l_value${room['id']}`)
        l_value.textContent = `${room['measurements'][room['measurements'].length-1]['light']}`;

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
      }else{
        const emptyMeasurementsText = document.createElement('div');
        emptyMeasurementsText.textContent = "No Data Logged";
        emptyMeasurementsText.setAttribute('style', 'color: grey');

        card_body.append(emptyMeasurementsText);
      }

      if (room['actions'].length) {
        // Need a label, value, and row for each
        const vent_row = document.createElement('div');
        const vent_label = document.createElement('p');
        const vent_value = document.createElement('p');
        const shade_row = document.createElement('div');
        const shade_label = document.createElement('p');
        const shade_value = document.createElement('p');


        vent_row.setAttribute('class', 'd-flex justify-content-between');
        vent_label.setAttribute('class', 'h2');
        // vent_label.setAttribute('style', 'color: red');
        vent_label.textContent = "Vent State:";
        vent_value.setAttribute('class', 'h2');
        vent_value.setAttribute('style', 'color: green');
        vent_value.setAttribute('id',`vent_value${room_id}`)

        
        shade_row.setAttribute('class', 'd-flex justify-content-between');
        shade_label.setAttribute('class', 'h2');
        // shade_label.setAttribute('style', 'color: red');
        shade_label.textContent = "Shade State:";
        shade_value.setAttribute('class', 'h2');
        shade_value.setAttribute('style', 'color: green');
        shade_value.setAttribute('id', `shade_value${room_id}`)

        // console.log("last action state: " + room['actions'][room['actions'].length-1]['status'])
        if (room['actions'][room['actions'].length-1]['status'] == 3)
        {
          if (room['actions'][room['actions'].length-1]['shade_state'] != null)
          {
            shade_value.textContent = shade_states[`${room['actions'][room['actions'].length-1]['shade_state']}`];
          }

          if (room['actions'][room['actions'].length-1]['vent_state'] != null){
            vent_value.textContent = vent_states[`${room['actions'][room['actions'].length-1]['vent_state']}`];
          }
        }
        else{
          shade_value.textContent = "Pending";
          shade_value.setAttribute('style', 'color: red');
          
          vent_value.textContent = "Pending";
          vent_value.setAttribute('style', 'color: red');
          };
        
        vent_row.append(vent_label);
        vent_row.append(vent_value);
        shade_row.append(shade_label);
        shade_row.append(shade_value);
        
        card_body.append(vent_row);
        card_body.append(shade_row);
      
      }else{
        const emptyActionsText = document.createElement('div');
        emptyActionsText.textContent = "No Actions Logged";
        emptyActionsText.setAttribute('style', 'color: grey');

        card_body.append(emptyActionsText);
      }

      // Create a button element
      const button_row = document.createElement('div');
      const vent_button = document.createElement('button');
      const shade_button = document.createElement('button');

      vent_button.setAttribute('id', `vent_button${room_id}`);
      vent_button.setAttribute('class', `btn btn-outline-light`);
      shade_button.setAttribute('id', `shade_button${room_id}`);
      shade_button.setAttribute('class', `btn btn-outline-light`);

      if (isDarkMode == 'true'){
        vent_button.setAttribute('class', `btn btn-outline-light`);
        shade_button.setAttribute('class', `btn btn-outline-light`);
      } else {
        vent_button.setAttribute('class', `btn btn-outline-dark`);
        shade_button.setAttribute('class', `btn btn-outline-dark`);
      }

      vent_button.textContent = "Toggle Vent";
      // Add an event listener for the click event to refresh the page
      vent_button.addEventListener('click', async function(event) {
        // Disable button until action fulfilled
        vent_button.disabled = true;
        vent_button.innerText = "Vent Toggle Pending...";
        shade_button.disabled = true;
        shade_button.innerText = "Disabled";
        
        // Prevent the event from propagating to the card
        event.stopPropagation();
        
        // Get last action
        const lastAction = await proxy.getLastActionByRoomID(room_id);
        // console.log(lastAction['vent_state']);

        // Create action object
        const actionObj = getCreateActionObject(
          0,
          0,
          lastAction['stop'],
          ((lastAction['vent_state'] * -1) + 1),
          (lastAction['shade_state']),
          lastAction['reboot']
        )

        // Get user ID from access_token
        const jwt = Utils.getJwt();
        const userID = jwt['user_id'];

        // Create action in database
        await proxy.createAction(room_id, actionObj);

        // Post message in notes
        const message = `[ACTION] Changing vent in room ${room_id} to ${vent_states[actionObj['vent_state']]}`; 
        await proxy.createRoomMessage(room_id, userID, message);
        // console.log("[SUCCESS] Created new action for room: " + room_id);
        
        renderRoomValues();
        });

      shade_button.textContent = "Toggle Shade";
      // Add an event listener for the click event to refresh the page
      shade_button.addEventListener('click', async function(event) {

        // Disable button until action fulfilled
        shade_button.disabled = true;
        shade_button.innerText = "Shade Toggle Pending..."
        vent_button.disabled = true;
        vent_button.innerText = "Disabled";

        // Prevent the event from propagating to the card
        event.stopPropagation();

        // Get last action
        const lastAction = await proxy.getLastActionByRoomID(room_id);
        // console.log(lastAction['shade_state']);

        // Create action object
        const actionObj = getCreateActionObject(
          0,
          0,
          lastAction['stop'],
          lastAction['vent_state'],
          ((lastAction['shade_state'] * -1) + 1),
          lastAction['reboot']
        )

        // Get user ID from access_token
        const jwt = Utils.getJwt();
        const userID = jwt['user_id'];

        // Create action in database
        await proxy.createAction(room_id, actionObj);

        // Post message in notes
        const message = `[ACTION] Changing shade in room ${room_id} to ${shade_states[actionObj['shade_state']]}`; 
        await proxy.createRoomMessage(room_id, userID, message);
        // console.log("[SUCCESS] Created new action for room: " + room_id)

        renderRoomValues();
        });    
        
      button_row.append(vent_button);
      button_row.append(shade_button);
      card_body.append(button_row);
  
      card_header.append(roomAlive);
      card_header.append(roomName);
      card.append(card_header);
      card.append(card_body);
      main.append(card);
    
      card.addEventListener('click', () => {
        // console.log(card.getAttribute('id'));
        sessionStorage.setItem('roomID', room_id);
        window.location.href = `/home/room/${room_id}`;
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

export async function renderRoomValues(intervalId) {

  const rooms = await proxy.getRooms();
  const agents = await proxy.getAgents();

  const vent_states = ['Open', 'Closed', 'Pending'];
  const shade_states = ['Open', 'Closed', 'Pending'];
  // console.log(rooms);

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.

  if (rooms.length) {
    rooms.forEach(room => {
      const room_id = room['id'];
      const room_card = document.getElementById(`${room_id}`);
      const roomName = room_card.getElementsByClassName('display-3')[0];

      const roomAlive = document.getElementById(`alive-button${room_id}`);

      try{
        if (agents[room_id-1]['status'] == 1)
          {
            toggleRoomAlive(roomAlive, room_id, intervalId);
          }
      } catch (error){
        
      }
      
      
      // Get agent 
      // const agent = await proxy.getAgentByID(room['id'])
      let agent_ip = " [...]";
        agents.forEach(agent => {
          if (room['id'] == agent['room_id'])
            {
              agent_ip = ` [${agent['device_ip_address']}]`;
            }
        })

      roomName.textContent = room["name"] + agent_ip;

      // if (agent_status == 0){
      //   roomName.setAttribute('style', 'color: grey')
      // }


      const status_value = document.getElementById(`status_value${room_id}`);

      let isStopped;
      try {
        isStopped = `${room['actions'][room['actions'].length-1]['stop']}`;
      } catch (error) {
        console.log("Room " + room_id + " " + error.message);
        isStopped = 1;
      }      
      
      if (isStopped == 0){
        // start_button.disabled = true;
        // stop_button.disabled = false;
        status_value.textContent = " Active (" + agents[room_id-1]['duration'] +")";
        status_value.setAttribute('style', 'color: green');
      }else{
        // start_button.disabled = false;
        // stop_button.disabled = true;
        status_value.textContent = " Inactive";
        status_value.setAttribute('style', 'color: grey');
      }
      
      if (room['measurements'].length) {
        // Need a label, value, and row for each

        const t_value = document.getElementById(`t_value${room_id}`);
        const h_value = document.getElementById(`h_value${room_id}`);
        const p_value = document.getElementById(`p_value${room_id}`);
        const l_value = document.getElementById(`l_value${room_id}`);

        t_value.textContent = `${room['measurements'][room['measurements'].length-1]['temperature']}`;
        h_value.textContent = `${room['measurements'][room['measurements'].length-1]['humidity']}`;
        p_value.textContent = `${room['measurements'][room['measurements'].length-1]['pressure']}`;
        l_value.textContent = `${room['measurements'][room['measurements'].length-1]['light']}`;
      }

      if (room['actions'].length) {
        // Need a label, value, and row for each
        const vent_value = document.getElementById(`vent_value${room_id}`);
        const shade_value = document.getElementById(`shade_value${room_id}`);
        const vent_button = document.getElementById(`vent_button${room_id}`);
        const shade_button= document.getElementById(`shade_button${room_id}`);

        vent_value.setAttribute('style', 'color: green');
        shade_value.setAttribute('style', 'color: green');
        
        // console.log("last action state: " + room['actions'][room['actions'].length-1]['status'])
        if (room['actions'][room['actions'].length-1]['status'] == 3)
        {
          // if (room['actions'][room['actions'].length-1]['shade_state'] != null)
          // {
            shade_value.textContent = shade_states[`${room['actions'][room['actions'].length-1]['shade_state']}`];
            shade_button.disabled = false;
            shade_button.textContent = "Toggle Shade";
          // }

          // if (room['actions'][room['actions'].length-1]['vent_state'] != null){
            vent_value.textContent = vent_states[`${room['actions'][room['actions'].length-1]['vent_state']}`];
            vent_button.disabled = false;
            vent_button.textContent = "Toggle Vent";
          // }
        }
        else{
          shade_value.textContent = "Pending";
          shade_value.setAttribute('style', 'color: red');
          vent_button.disabled = true;
          vent_button.textContent = "Disabled";
          
          vent_value.textContent = "Pending";
          vent_value.setAttribute('style', 'color: red');
          vent_button.disabled = true;
          vent_button.textContent = "Disabled";
          }; 
      }
    });
  }
}

function renderNewRoomCard() {
  const body = document.body;
  const main = document.createElement('main');
  body.append(main);

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.

  // Create an array to keep track of references for each card created

  const card = document.createElement('div');
  const plusIcon = document.createElement('img');
  const title = document.createElement('h2');
  const button = document.createElement('button');
  button.setAttribute('class', 'modal-trigger');
  card.setAttribute('class', 'plus-card');
  plusIcon.setAttribute('src', 'images/plus.png');
  plusIcon.setAttribute('width', '50px');
  title.textContent = "add new room";
  button.textContent = "create room";

  card.append(plusIcon);
  card.append(button);
  main.append(card);
}

function getCreateActionObject(ack, status, stop, vent_state, shade_state, reboot) {

  const action = {
      "ack": ack,
      "status": status,
      "stop": stop,
      "vent_state": vent_state,
      "shade_state": shade_state,
      "reboot": reboot
  };
  return action;
}

function getCreateServerObject(ip_address) {
  const server = {
    "ip_address": ip_address,
    "greenhouse_id": 1,
    "name": "Default Greenhouse Server"
  };

  return server;
}

async function createFirstServer(local) {
  // Get server info and create new server if none exists,
  // returns ip address of this first server
  const servers = await proxy.getServers();
  let server_ip = '';

  if (servers.length == 0) { // No servers
    if (local == true) { // localHost
      server_ip = '127.0.0.1';
      console.log(`Creating server at ${server_ip}`);
      const serverObj = getCreateServerObject(server_ip);
      await proxy.createServer(serverObj).then(
        response => {console.log(response);});
      
    } else {
      server_ip = await proxy.getServerIPByID(1)[1];
      console.log(`Creating server at ${server_ip}`);
      const serverObj = getCreateServerObject(server_ip);
      await proxy.createServer(serverObj).then(
        response => {console.log(response);});
    }
  } else {
    server_ip = servers[0]['ip_address'];
    console.log(`[SERVER] Server already exists at ${server_ip}`);
  }
  return server_ip;
}

function displayServerIPAddress(server_ip) {
  // Display server ip address
  const serverIPText = document.getElementById('server-ip');
  serverIPText.textContent = `Server IPv4 Address: ${server_ip}`;
  serverIPText.href = `http://${server_ip}:5000/servers`;
}

async function sendAckRequest(room_id) {
  // Send acknowledgment request to agent
  const lastAction = await proxy.getLastActionByRoomID(room_id)
  const action = getCreateActionObject(
    1,
    0,
    lastAction['stop'],
    lastAction['vent_state'],
    lastAction['shade_state'],
    lastAction['reboot']
  );
  const response = await proxy.createAction(room_id, action);
  return response;
}

async function checkAckResponse(room_id) {
  // Checks status of last acknowledgement request sent to agent
  const lastAction = await proxy.getLastFieldActionByRoomID(room_id, 'ack', 1);
  // console.log("ACK DEBUG STATUS: " + lastAction['ack'] +  " status: " + lastAction['status']);
  if (lastAction['status'] != 0){
    console.log(`Room ID ${room_id} Acknowledged: ${lastAction['ack']}`);
    return lastAction['ack'];
  } else {
    console.log(`Room ID ${room_id} Acknowledged: ${0}`);
    return 0; 
  }
}

// Wait for `delay` milliseconds
const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function checkRoomAlive(room_id, roomTimeout){
  await sendAckRequest(room_id);

  const agents = await proxy.getAgents(room_id);
  // console.log("Integer duration in seconds: " + Utils.timeStringToSeconds(agents[room_id-1]['duration'], 10));
  // console.log("duration: " + agents[room_id-1]['duration']);

  // wait 'duration' milliseconds for agent to acknowledge request plus additional second
  await sleepNow(Utils.timeStringToSeconds(agents[room_id-1]['duration'], 10) * 1000 + 1000); 
  
  return await checkAckResponse(room_id);
  // try {
  //   console.log("Trying Acknowledge timeout: " + roomTimeout/1000 + " seconds.")
  //   let response = await Utils.withTimeout(checkAckResponse(room_id), roomTimeout);
  //   console.log("Check Room Alive Response: " + response);
  //   return response;
  // } catch (error) {
  //   console.error(error.message);
  //   return -1;
  // }
}

// Function to redirect to a relative URL
function redirectToDownloadCSV(server_ip, room_id) 
{
  let absoluteURL = 
    `http://${server_ip}:5000/rooms/${room_id}/measurement/csv`;

  absoluteURL = new URL(absoluteURL);

  // Log the absolute URL (optional)
  console.log('Redirecting to:', absoluteURL.href);

  // Redirect to the absolute URL
  window.location.href = absoluteURL.href;
}

//toggleRoomAlive(): checks if room is on if it is on it is green (alive-button-on)
// if it isn't on it is off. When it is off remove on and pending class set to off class(CSS). 
async function toggleRoomAlive(powerButton, room_id, intervalID){
  const agents = await proxy.getAgents();
  try {
    const agent = agents[room_id-1];
    // Stop updating card values
    // clearInterval(intervalID);
    
    if (agent['status'] == 0)
    {
      powerButton.classList.remove('alive-button-off');
      powerButton.classList.add('alive-button-pending');
    } 

    let isAlive = await checkRoomAlive(room_id, 6000);

    if (isAlive == 1){
      // Change status of agent to 'on'
      switchPowerAliveButton(powerButton, room_id, 1)
    } else {
      // Change status of agent to 'off'
      isAlive = await checkRoomAlive(room_id, 6000);
      if (isAlive == 1){
        switchPowerAliveButton(powerButton, room_id, 1)
      } else {
        switchPowerAliveButton(powerButton, room_id, 0)
      }   
    }
  } catch (error) {
    console.log("Room " + room_id + " " + error.message);
  }  

  // // Start the interval to update room values within room cars
  // intervalId = setInterval(renderRoomValues, 8000, intervalId);
}

async function switchPowerAliveButton(powerButton, room_id, status)
{
  if (status == 1){
    // Change status of agent to 'on'
    await proxy.updateAgent(room_id, {"status": 1})
    powerButton.classList.remove('alive-button-pending');
    powerButton.classList.remove('alive-button-pending-green');
    powerButton.classList.add('alive-button-on');
  } else {
    await proxy.updateAgent(room_id, {"status": 0})
    powerButton.classList.remove('alive-button-on');
    powerButton.classList.remove('alive-button-pending');
    powerButton.classList.remove('alive-button-pending-green');
    powerButton.classList.add('alive-button-off');
  }

}

// Create first server
const server_ip = await createFirstServer(true);

// Display server ip address on navbar
displayServerIPAddress(server_ip);

// Start the interval to update room values within room cars
let intervalId = setInterval(renderRoomValues, 8000);

// Render all room cards
await renderRoomCards(intervalId);

// New room card button
// renderNewRoomCard();