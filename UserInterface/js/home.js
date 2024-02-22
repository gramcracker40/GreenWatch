import { GreenhouseProxy } from "../api/api.js";
import * as Utils from "../js/utilities.js";

const proxy = new GreenhouseProxy();
const room_grid = document.getElementById('room-grid');
const main = document.createElement('main');
room_grid.append(main);

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

hideSettings();

const logoutLink = document.getElementById('logout-link');
logoutLink.addEventListener('click', Utils.logout);

function resetRoomsList() {
  while(main.firstChild) {
    main.removeChild(main.lastChild);
  }
}

export async function renderRoomCards() {
  resetRoomsList();

  const rooms = await proxy.getRooms();
  const agents = await proxy.getAgents();

  const vent_states = ['Open', 'Closed', 'Pending']
  const shade_states = ['Open', 'Closed', 'Pending']
  // console.log(rooms);

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.

  if (rooms.length) {
    rooms.forEach(room => {
      const card = document.createElement('div');
      const card_header = document.createElement('div');
      const card_body = document.createElement('div');    // Needs to containt multiple rows
      const roomName = document.createElement('h2');
      
      card.setAttribute('class', 'room-card');
      card.setAttribute('id', `${room['id']}`)
      card_header.setAttribute('class', 'card-header');
      card_body.setAttribute('class', 'row');
      roomName.setAttribute('class', 'display-3');
      roomName.setAttribute('style', 'color: grey')
      

      // Get agent 
      // const agent = await proxy.getAgentByID(room['id'])
      let agent_ip = " [...]";
        agents.forEach(agent => {
          if (room['id'] == agent['room_id'])
            {
              agent_ip = ` [${agent['ip_address']}]`
              roomName.setAttribute('style', 'color: black')
            }
        })

      roomName.textContent = room["name"] + agent_ip;

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
        t_label.setAttribute('class', 'h1');
        t_label.textContent = "Temperature:";
        t_value.setAttribute('class', 'h1');
        t_value.setAttribute('id', `t_value${room['id']}`)
        t_value.textContent = `${room['measurements'][room['measurements'].length-1]['temperature']}`;
        h_row.setAttribute('class', 'd-flex justify-content-between');
        h_label.setAttribute('class', 'h1');
        h_label.textContent = "Humidity:";
        h_value.setAttribute('class', 'h1');
        h_value.setAttribute('id', `h_value${room['id']}`)
        h_value.textContent = `${room['measurements'][room['measurements'].length-1]['humidity']}`;
        p_row.setAttribute('class', 'd-flex justify-content-between');
        p_label.setAttribute('class', 'h1');
        p_label.textContent = "Pressure:";
        p_value.setAttribute('class', 'h1');
        p_value.setAttribute('id', `p_value${room['id']}`)
        p_value.textContent = `${room['measurements'][room['measurements'].length-1]['pressure']}`;
        l_label.setAttribute('class', 'h1');
        l_label.textContent = "Light:";
        l_row.setAttribute('class', 'd-flex justify-content-between');
        l_value.setAttribute('class', 'h1');
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
        vent_value.setAttribute('id',`vent_value${room['id']}`)

        
        shade_row.setAttribute('class', 'd-flex justify-content-between');
        shade_label.setAttribute('class', 'h2');
        // shade_label.setAttribute('style', 'color: red');
        shade_label.textContent = "Shade State:";
        shade_value.setAttribute('class', 'h2');
        shade_value.setAttribute('style', 'color: green');
        shade_value.setAttribute('id', `shade_value${room['id']}`)
        

        console.log("last action state: " + room['actions'][room['actions'].length-1]['status'])
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

      vent_button.setAttribute('id', `vent_button${room['id']}`);
      shade_button.setAttribute('id', `shade_button${room['id']}`);

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
        
        const roomID = room['id'];

        // Get last action
        const lastAction = await proxy.getLastActionByRoomID(roomID);
        // console.log(lastAction['vent_state']);

        // Create action object
        const actionObj = getCreateActionObject(
          0,
          ((lastAction['vent_state'] * -1) + 1),
          (lastAction['shade_state']
          )
        )

        // Get user ID from access_token
        const jwt = Utils.getJwt();
        const userID = jwt['user_id'];

        // Create action in database
        await proxy.createAction(roomID, actionObj);

        // Post message in notes
        const message = `[ACTION] Changing vent in room ${roomID} to ${vent_states[actionObj['vent_state']]}`; 
        await proxy.createRoomMessage(roomID, userID, message);
        console.log("[SUCCESS] Created new action for room: " + roomID);
        
        // Refresh the current page
        // location.reload();
        // console.log("[TEST] Reloading Page...");
        
        // Refresh cards
        // renderRoomCards();
        renderRoomValues();
        console.log("[TEST] Reloading Cards...");
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
        
        const roomID = room['id'];

        // Get last action
        const lastAction = await proxy.getLastActionByRoomID(roomID);
        // console.log(lastAction['shade_state']);

        // Create action object
        const actionObj = getCreateActionObject(
          0,
          lastAction['vent_state'],
          ((lastAction['shade_state'] * -1) + 1)
          )

        // Get user ID from access_token
        const jwt = Utils.getJwt();
        const userID = jwt['user_id'];

        // Create action in database
        await proxy.createAction(roomID, actionObj);

        // Post message in notes
        const message = `[ACTION] Changing shade in room ${roomID} to ${shade_states[actionObj['shade_state']]}`; 
        await proxy.createRoomMessage(roomID, userID, message);
        console.log("[SUCCESS] Created new action for room: " + roomID)
        
        // Refresh the current page
        // location.reload();
        // console.log("[TEST] Reloading Page...");
        
        // Refresh cards
        renderRoomValues();
        console.log("[TEST] Reloading Cards...");

        });    
        
      button_row.append(vent_button);
      button_row.append(shade_button);
      card_body.append(button_row);
  
      
      card_header.append(roomName);
      card.append(card_header);
      card.append(card_body);
      main.append(card);
    
      card.addEventListener('click', () => {
        // console.log(card.getAttribute('id'));
        sessionStorage.setItem('roomID', room['id']);
        window.location.href = `/home/room/${room['id']}`;
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

export async function renderRoomValues() {
  // resetRoomsList();

  const rooms = await proxy.getRooms();
  const agents = await proxy.getAgents();

  const agent_response = await proxy.pingAgentByID(1); // TESTING: just for first agent
  const agent_status = agent_response['success'];
  console.log(`Agent 1 ping status: ${agent_status}`);
  // console.log(rooms[0])
  // if (rooms.length){
  //   agent_status = await proxy.pingAgentByID(1)['success']
  //   console.log(`Agent 1 ping status: ${agent_status}`)
  // }

  const vent_states = ['Open', 'Closed', 'Pending']
  const shade_states = ['Open', 'Closed', 'Pending']
  // console.log(rooms);

  // forEach room, in rooms, create a card and append it to main.
  // Also set the information for the card.

  if (rooms.length) {
    rooms.forEach(room => {
      const room_card = document.getElementById(`${room['id']}`)
      const roomName = room_card.getElementsByClassName('display-3')[0]

      // Get agent 
      // const agent = await proxy.getAgentByID(room['id'])
      let agent_ip = " [...]";
        agents.forEach(agent => {
          if (room['id'] == agent['room_id'])
            {
              agent_ip = ` [${agent['ip_address']}]`
              roomName.setAttribute('style', 'color: black')
            }
        })

      roomName.textContent = room["name"] + agent_ip;

      if (agent_status == 0){
        roomName.setAttribute('style', 'color: grey')
      }


      if (room['measurements'].length) {
        // Need a label, value, and row for each

        const t_value = document.getElementById(`t_value${room['id']}`)
        const h_value = document.getElementById(`h_value${room['id']}`)
        const p_value = document.getElementById(`p_value${room['id']}`)
        const l_value = document.getElementById(`l_value${room['id']}`)

        t_value.textContent = `${room['measurements'][room['measurements'].length-1]['temperature']}`;
        h_value.textContent = `${room['measurements'][room['measurements'].length-1]['humidity']}`;
        p_value.textContent = `${room['measurements'][room['measurements'].length-1]['pressure']}`;
        l_value.textContent = `${room['measurements'][room['measurements'].length-1]['light']}`;
      }

      if (room['actions'].length) {
        // Need a label, value, and row for each
        const vent_value = document.getElementById(`vent_value${room['id']}`)
        const shade_value = document.getElementById(`shade_value${room['id']}`);
        const vent_button = document.getElementById(`vent_button${room['id']}`);
        const shade_button= document.getElementById(`shade_button${room['id']}`);

        vent_value.setAttribute('style', 'color: green');
        shade_value.setAttribute('style', 'color: green');
        
        // console.log("last action state: " + room['actions'][room['actions'].length-1]['status'])
        if (room['actions'][room['actions'].length-1]['status'] == 3)
        {
          // if (room['actions'][room['actions'].length-1]['shade_state'] != null)
          // {
            shade_value.textContent = shade_states[`${room['actions'][room['actions'].length-1]['shade_state']}`];
            shade_button.disabled = false;
            shade_button.textContent = "Toggle Shade"
          // }

          // if (room['actions'][room['actions'].length-1]['vent_state'] != null){
            vent_value.textContent = vent_states[`${room['actions'][room['actions'].length-1]['vent_state']}`];
            vent_button.disabled = false;
            vent_button.textContent = "Toggle Vent"
          // }
        }
        else{
          shade_value.textContent = "Pending";
          shade_value.setAttribute('style', 'color: red');
          vent_button.disabled = true;
          vent_button.textContent = "Disabled"
          
          
          vent_value.textContent = "Pending";
          vent_value.setAttribute('style', 'color: red');
          vent_button.disabled = true;
          vent_button.textContent = "Disabled"
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

function getCreateActionObject(status, vent_state, shade_state) {

  const action = {
      "status": status,
      "stop": 0,
      "vent_state": vent_state,
      "shade_state": shade_state,
      "reboot": 0
  };

  return action;
}

renderRoomCards();

// Start the interval
let intervalId = setInterval(renderRoomValues, 10000);
// renderNewRoomCard();