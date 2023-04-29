import { GreenhouseProxy } from "../api/api";

const proxy = new GreenhouseProxy();

// Get experiments card-body to list each experiment
const experimentCardBody = document.getElementById('experiment-card-body')

// Create a new list to hold each room card item
const experimentListGroup = document.createElement('ul');
experimentListGroup.setAttribute('class', 'list-group');
experimentCardBody.append(experimentListGroup);

function resetExperiementList() {
  while(experimentListGroup.firstChild) {
    experimentListGroup.removeChild(experimentListGroup.lastChild);
  }
}

// Get all experiments for active room

// Create cards for experiments
async function renderExperimentCards() {
  // Create card structure
  const card = document.createElement('div');
  const experimentName = document.createElement('div');
  const tHigh = document.createElement('div'); // make this another card so it looks good
  const tLow = document.createElement('div');
  const hHigh = document.createElement('div');
  const hLow = document.createElement('div');
  const icons = document.createElement('div');
  const edit = document.createElement('i');
  const trash = document.createElement('i'); 

  experimentListGroup.append(card);

  card.setAttribute('class', 'list-group-item justify-content-between d-flex align-items-center');
  

  edit.setAttribute('class', 'fa-solid fa-pen-to-square btn btn-outline-dark m-2');
  edit.setAttribute('data-bs-target', '#users-modal-edit');
  edit.setAttribute('data-bs-toggle', 'modal');
  trash.setAttribute('class', 'fa-solid fa-trash btn btn-outline-danger m-2');
  trash.setAttribute('data-bs-target', '#users-modal-delete');
  trash.setAttribute('data-bs-toggle', 'modal');


}

// Attach each card to a list-group to be listed in the experiments card-body
