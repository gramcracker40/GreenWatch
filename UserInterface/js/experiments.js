import { GreenhouseProxy } from "../api/api.js";
import * as Utils from "../js/utilities.js";

const proxy = new GreenhouseProxy();

// Get experiments card-body to list each experiment
const experimentCardBody = document.getElementById('experiment-card-body')

// Create a new list to hold each room card item
const experimentListGroup = document.createElement('ul');
experimentListGroup.setAttribute('class', 'list-group');
experimentCardBody.append(experimentListGroup);

// -------------- Create Exp Modal Button Events -------------- //
const showCreateExpModalButton = document.getElementById('show-create-exp-modal-btn');
showCreateExpModalButton.addEventListener('click', () => {
  document.addEventListener('keyup', checkCreateExperimentFields);
  document.addEventListener('mouseup', checkCreateExperimentFields);
  checkCreateExperimentFields();
});

const cancelCreateExpButton = document.getElementById('cancel-create-exp-button');
cancelCreateExpButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkCreateExperimentFields);
  document.removeEventListener('mouseup', checkCreateExperimentFields);
})

const createExpButton = document.getElementById('create-exp-button');
createExpButton.addEventListener('click', createExperiment);
createExpButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkCreateExperimentFields);
  document.removeEventListener('mouseup', checkCreateExperimentFields);
});

// -------------- Delete Exp Modal Button Events -------------- //
const cancelDeleteExpButton = document.getElementById('cancel-delete-exp-button');
cancelDeleteExpButton.addEventListener('click', () => {
  sessionStorage.removeItem('experimentID');
});

const deleteExpButton = document.getElementById('delete-exp-button');
deleteExpButton.addEventListener('click', deleteExperiment);

function resetExperiementList() {
  // console.log("Resetting experiment list");
  while(experimentListGroup.firstChild) {
    experimentListGroup.removeChild(experimentListGroup.lastChild);
  }
}

// -------------- Edit Exp Modal Button Events -------------- //
const cancelEditExpButton = document.getElementById('cancel-edit-exp-button');
cancelEditExpButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkEditExperimentFields);
  document.removeEventListener('mouseup', checkEditExperimentFields);
});

const editExpButton = document.getElementById('edit-exp-button');
editExpButton.addEventListener('click', editExp);
editExpButton.addEventListener('click', () => {
  document.removeEventListener('keyup', checkEditExperimentFields);
  document.removeEventListener('mouseup', checkEditExperimentFields);
});

function hideExperimentsBtn() {
  const jwt = Utils.getJwt();
  const token = Utils.parseJwt(JSON.stringify(jwt));

  const addExpBtn = document.getElementById('show-create-exp-modal-btn');
  if (token['admin']) {
    addExpBtn.style.visibility = "visible";
  }else{
    addExpBtn.style.visibility = "hidden";
  }
}

hideExperimentsBtn();

// Function to add rows to experiment tables
function AddRows(names, experiment, expTable){
  for(let i = 0; i < names.length; i++){
    const newRow = document.createElement('tr');

    // Create cells for the data: type, low, and high
    const typeCell = document.createElement('td');
    typeCell.textContent = names[i][0];
    // typeCell.style.textAlign = 'center';
    const lowCell = document.createElement('td');
    lowCell.textContent = experiment['lower_' + names[i][1]];
    lowCell.style.color = 'blue';
    const highCell = document.createElement('td');
    highCell.textContent = experiment['upper_' + names[i][1]];
    highCell.style.color = 'red';
  
    // Append cells to the row
    newRow.appendChild(typeCell);
    newRow.appendChild(lowCell);
    newRow.appendChild(highCell);
  
    // Append the row to the table
    expTable.appendChild(newRow);
  }
}

// Create cards for experiments
async function renderExperimentCards() {
  // console.log("Rendering experiments");
  // Refresh the current list for accuracy
  resetExperiementList();

  // Get all experiments
  const experiments = await proxy.getExperiments();
  // console.log(experiments);

  // Get the current roomID
  const currentRoom = sessionStorage.getItem('roomID');

  experiments.forEach(experiment => {
    // Check if experiment id matches current room
    if (experiment['room_id'] == currentRoom) {
      // Create card structure
      const listItem = document.createElement('div');
      const row = document.createElement('div');
      const nameDiv = document.createElement('div');
      const tableDiv = document.createElement('div');
      const expTable = document.createElement('table');
      const headerRow = document.createElement('tr');
      const measurementHeader = document.createElement('th');
      const lowHeader = document.createElement('th');
      const highHeader = document.createElement('th');
      const icons = document.createElement('div');
      const edit = document.createElement('i');
      const trash = document.createElement('i'); 


      listItem.setAttribute('class', 'list-group-item justify-content-between align-items-center');
      nameDiv.setAttribute('class', 'col-12 mb-3 text-center fs-2');
      nameDiv.textContent = experiment['name'];

      row.setAttribute('class', 'd-flex')
      tableDiv.setAttribute('class', ' align-items-center col-9');

      // if the user is an admin, then append the icons
      if (Utils.parseJwt(Utils.getJwt()['access_token'])['admin']) {
        icons.append(edit);
        icons.append(trash);
      }

      icons.setAttribute('class', 'd-flex flex-column col-3');
      edit.setAttribute('class', 'fa-solid fa-pen-to-square btn btn-outline-dark m-2');
      edit.setAttribute('data-bs-target', '#edit-experiment-modal');
      edit.setAttribute('data-bs-toggle', 'modal');
      trash.setAttribute('class', 'fa-solid fa-trash btn btn-outline-danger m-2');
      trash.setAttribute('data-bs-target', '#delete-experiment-modal');
      trash.setAttribute('data-bs-toggle', 'modal');


      expTable.setAttribute('class', 'table');
      measurementHeader.textContent = 'Measurement';
      measurementHeader.style.textAlign = 'center';
      lowHeader.textContent = 'Low';
      lowHeader.style.textAlign = 'center';
      highHeader.textContent = 'High';
      highHeader.style.textAlign = 'center';

      experimentListGroup.append(listItem);
      listItem.append(nameDiv, row);
      row.append(icons, tableDiv);
      tableDiv.append(expTable);
      expTable.appendChild(headerRow);
      headerRow.append(measurementHeader, lowHeader, highHeader);

      const names = [['Temperature', 'temp'],
                     ['Humidity', 'hum']];
      
      AddRows(names, experiment, expTable);



      // Only allow viewing of experiment if it is the active experiment of the room
      // if (experiment['active']) {
        const view = document.createElement('i');

        view.setAttribute('class', 'fa-solid fa-eye btn btn-outline-primary m-2');
        view.setAttribute('data-bs-target', '#view-experiment-modal');
        view.setAttribute('data-bs-toggle', 'modal');

        // icons.append(view);

        view.addEventListener('click', () => {
          // Store the experiment id (and name?)
          sessionStorage.setItem('experimentID', experiment['id']);
        });
      // }

      edit.addEventListener('click', () => {
        // Store the experiment object
        const expString = JSON.stringify(experiment);
        sessionStorage.setItem('selectedExp', expString);

        const modalTitle = document.getElementById('edit-exp-modal-title');
        modalTitle.textContent = `Editing: ${experiment['name']}`;

        setExpEditPlaceholderValues();
        checkEditExperimentFields();

        document.addEventListener('keyup', checkEditExperimentFields);
        document.addEventListener('mouseup', checkEditExperimentFields);
      });

      trash.addEventListener('click', () => {
        // Store the experiment id (and name?)
        sessionStorage.setItem('experimentID', experiment['id']);
      });
    }
  });
}

renderExperimentCards();

// -------------- Delete Exp Modal Functions -------------- //
async function deleteExperiment() {
  const experimentID = sessionStorage.getItem('experimentID');
  sessionStorage.removeItem('experimentID');

  await proxy.deleteExperiment(experimentID);
  renderExperimentCards();
}

// -------------- Create Exp Modal Functions -------------- //
function getCreateExperimentObj() {
  const experimentName = document.getElementById('experiment-name');
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');
  const tHighThreshold = document.getElementById('temp-high-threshold');
  const tLowThreshold = document.getElementById('temp-low-threshold');
  const hHighThreshold = document.getElementById('hum-high-threshold');
  const hLowThreshold = document.getElementById('hum-low-threshold');

  const experiment = {
    "start": startDate.value,
    "end": endDate.value,
    "alert_on": true,
    "lower_temp": tLowThreshold.value,
    "upper_hum": hHighThreshold.value,
    "name": experimentName.value,
    "upper_temp": tHighThreshold.value,
    "lower_hum": hLowThreshold.value,
    "room_id": sessionStorage.getItem('roomID')
  }

  return experiment;
}

function isObjFieldsEmpty(experiment) {
  const fieldsEmptyText = document.getElementById('exp-create-invalid-text');
  for (const key in experiment) {
    if (experiment[key] == "") {
      fieldsEmptyText.style.visibility = 'visible';
      return true;
    } 
  }
  fieldsEmptyText.style.visibility = 'hidden';
  return false;
}

function isExperimentNameTooLong(name) {
  const invalidNameLengthText = document.getElementById('exp-create-invalid-name-length-text');
  if (name.length > Utils.MAX_NAME_LENGTH) {
    invalidNameLengthText.style.visibility = 'visible';
    return true;
  }
  invalidNameLengthText.style.visibility = 'hidden';
  return false;
}

function checkCreateExperimentFields() {
  const experiment = getCreateExperimentObj();


  const isEmpty = isObjFieldsEmpty(experiment);
  const nameTooLong = isExperimentNameTooLong(experiment['name']);
  
  if (!isEmpty && !nameTooLong) {
    // enable create button
    createExpButton.disabled = false;
  }else{
    // disable create button
    createExpButton.disabled = true;
  }
}

function resetCreateExperimentFields() {
  const experimentName = document.getElementById('experiment-name');
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');
  const tHighThreshold = document.getElementById('temp-high-threshold');
  const tLowThreshold = document.getElementById('temp-low-threshold');
  const hHighThreshold = document.getElementById('hum-high-threshold');
  const hLowThreshold = document.getElementById('hum-low-threshold');

  experimentName.value = '';
  startDate.value = '';
  endDate.value = '';
  tHighThreshold.value = '';
  tLowThreshold.value = '';
  hHighThreshold.value = '';
  hLowThreshold.value = '';
}

async function createExperiment() {
  const experiment = getCreateExperimentObj();
  const roomID = sessionStorage.getItem('roomID');

  experiment['start'] = new Date(experiment['start']).toISOString().slice(0,-1);
  experiment['end'] = new Date(experiment['end']).toISOString().slice(0,-1);
  experiment['lower_hum'] = parseInt(experiment['lower_hum']);
  experiment['lower_temp'] = parseInt(experiment['lower_temp']);
  experiment['upper_hum'] = parseInt(experiment['upper_hum']);
  experiment['upper_temp'] = parseInt(experiment['upper_temp']);
  experiment['room_id'] = parseInt(roomID);

  await proxy.createExpirement(experiment);
  resetCreateExperimentFields();
  renderExperimentCards();
}

// -------------- Edit Exp Modal Functions -------------- //
function setExpEditPlaceholderValues() {
  const previousExpString = sessionStorage.getItem('selectedExp');
  const previousExp = JSON.parse(previousExpString);

  let startDateStr = new Date(previousExp['start']);
  const startDateStrDate = startDateStr.getDate();
  const startDateStrMonth = parseInt(startDateStr.getMonth())+1
  const startDateStrYear = startDateStr.getFullYear();
  startDateStr = `${startDateStrMonth}/${startDateStrDate}/${startDateStrYear}`;

  let endDateStr = new Date(previousExp['end']);
  const endDateStrDate = endDateStr.getDate();
  const endDateStrMonth = parseInt(endDateStr.getMonth())+1
  const endDateStrYear = endDateStr.getFullYear();
  endDateStr = `${endDateStrMonth}/${endDateStrDate}/${endDateStrYear}`;


  // Get values from input fields
  const experimentName = document.getElementById('edit-experiment-name');
  const startDate = document.getElementById('edit-start-date');
  const endDate = document.getElementById('edit-end-date');
  const tHighThreshold = document.getElementById('edit-temp-high-threshold');
  const tLowThreshold = document.getElementById('edit-temp-low-threshold');
  const hHighThreshold = document.getElementById('edit-hum-high-threshold');
  const hLowThreshold = document.getElementById('edit-hum-low-threshold');

  // Set placeholder values of inputs
  experimentName.setAttribute('placeholder', previousExp['name']);
  startDate.setAttribute('placeholder', startDateStr);
  startDate.setAttribute('onfocus', "(this.type='date')");
  startDate.setAttribute('onblur', "(this.type='text')");
  endDate.setAttribute('placeholder', endDateStr);
  endDate.setAttribute('onfocus', "(this.type='date')");
  endDate.setAttribute('onblur', "(this.type='text')");
  tHighThreshold.setAttribute('placeholder', previousExp['upper_temp']);
  tLowThreshold.setAttribute('placeholder', previousExp['lower_temp']);
  hHighThreshold.setAttribute('placeholder', previousExp['upper_hum']);
  hLowThreshold.setAttribute('placeholder', previousExp['lower_hum']);
}

function getEditExperimentInputFields() {
  // Get values from input fields
  const experimentName = document.getElementById('edit-experiment-name');
  const startDate = document.getElementById('edit-start-date');
  const endDate = document.getElementById('edit-end-date');
  const tHighThreshold = document.getElementById('edit-temp-high-threshold');
  const tLowThreshold = document.getElementById('edit-temp-low-threshold');
  const hHighThreshold = document.getElementById('edit-hum-high-threshold');
  const hLowThreshold = document.getElementById('edit-hum-low-threshold');

  const experiment = {
    "start": startDate.value,
    "end": endDate.value,
    "alert_on": true,
    "lower_temp": tLowThreshold.value,
    "upper_hum": hHighThreshold.value,
    "name": experimentName.value,
    "upper_temp": tHighThreshold.value,
    "lower_hum": hLowThreshold.value
  }

  return experiment;
}

function populateEmptyFields() {
  // Pull previous user from session storage
  const previousExpString = sessionStorage.getItem('selectedExp');
  const previousExp = JSON.parse(previousExpString);

  let experiment = getEditExperimentInputFields();

  // Populate any field that is empty
  for (const key in experiment) {
    if (experiment[key] == "") {
      experiment[key] = previousExp[key];
    }
  }

  return experiment;
}

function resetEditExperimentFields() {
  const experimentName = document.getElementById('edit-experiment-name');
  const startDate = document.getElementById('edit-start-date');
  const endDate = document.getElementById('edit-end-date');
  const tHighThreshold = document.getElementById('edit-temp-high-threshold');
  const tLowThreshold = document.getElementById('edit-temp-low-threshold');
  const hHighThreshold = document.getElementById('edit-hum-high-threshold');
  const hLowThreshold = document.getElementById('edit-hum-low-threshold');

  experimentName.value = '';
  startDate.value = '';
  endDate.value = '';
  tHighThreshold.value = '';
  tLowThreshold.value = '';
  hHighThreshold.value = '';
  hLowThreshold.value = '';
}

function isEditExperimentNameTooLong(name) {
  const invalidNameLengthText = document.getElementById('edit-exp-invalid-name-length-text');
  if (name.length > Utils.MAX_NAME_LENGTH) {
    invalidNameLengthText.style.visibility = 'visible';
    return true;
  }
  invalidNameLengthText.style.visibility = 'hidden';
  return false;
}

function checkEditExperimentFields() {
  const experiment = getEditExperimentInputFields();
  // console.log(experiment);

  const nameTooLong = isEditExperimentNameTooLong(experiment['name']);
  
  if (!nameTooLong) {
    // enable create button
    createExpButton.disabled = false;
  }else{
    // disable create button
    createExpButton.disabled = true;
  }
}

async function editExp() {
  const prevExperimentStr = sessionStorage.getItem('selectedExp');
  const prevExperiment = JSON.parse(prevExperimentStr);
  // sessionStorage.removeItem('selectedExp');
  // console.log(prevExperiment);

  const potentialExp = getEditExperimentInputFields();
  // console.log(potentialExp);

  const exp = populateEmptyFields(potentialExp);
  // console.log(exp);

  exp['start'] = new Date(exp['start']).toISOString().slice(0,-1);
  exp['end'] = new Date(exp['end']).toISOString().slice(0,-1);
  exp['lower_hum'] = parseInt(exp['lower_hum']);
  exp['lower_temp'] = parseInt(exp['lower_temp']);
  exp['upper_hum'] = parseInt(exp['upper_hum']);
  exp['upper_temp'] = parseInt(exp['upper_temp']);
  // console.log(exp);

  await proxy.editExperiment(prevExperiment['id'], exp);

  renderExperimentCards();
  resetEditExperimentFields();
}

// -------------- View Exp Modal Functions -------------- //
