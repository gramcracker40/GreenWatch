import { GreenhouseProxy } from "../api/api.js";

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
  const experiments = await proxy.getExperiments();
  console.log(experiments);

  // Create card structure
  const listItem = document.createElement('div');
  const experimentName = document.createElement('div');
  const thresholdDiv = document.createElement('div');
  const tHighCard = document.createElement('div');
  const tHighCardHeader = document.createElement('div');
  const tHighCardBody = document.createElement('div');
  const tLowCard = document.createElement('div');
  const tLowCardHeader = document.createElement('div');
  const tLowCardBody = document.createElement('div');
  const hHighCard = document.createElement('div');
  const hHighCardHeader = document.createElement('div');
  const hHighCardBody = document.createElement('div');
  const hLowCard = document.createElement('div');
  const hLowCardHeader = document.createElement('div');
  const hLowCardBody = document.createElement('div');
  const icons = document.createElement('div');
  const view = document.createElement('i');
  const edit = document.createElement('i');
  const trash = document.createElement('i'); 

  thresholdDiv.setAttribute('class', 'd-flex align-items-center');
  listItem.setAttribute('class', 'list-group-item justify-content-between d-flex align-items-center');

  // experimentName.setAttribute('class', '')
  experimentName.textContent = "Placeholder Name";
  tHighCard.setAttribute('class', 'card m-2 p-2');
  tHighCardHeader.setAttribute('class', 'card-header');
  tHighCardHeader.textContent = "Temperature High";
  tHighCardBody.setAttribute('class', 'card-body justify-content-center');
  tHighCardBody.textContent = "--";
  tLowCard.setAttribute('class', 'card m-2 p-2');
  tLowCardHeader.setAttribute('class', 'card-header');
  tLowCardHeader.textContent = "Temperature Low";
  tLowCardBody.setAttribute('class', 'card-body justify-content-center');
  tLowCardBody.textContent = "--";
  hHighCard.setAttribute('class', 'card m-2 p-2');
  hHighCardHeader.setAttribute('class', 'card-header');
  hHighCardHeader.textContent = "Humidity High";
  hHighCardBody.setAttribute('class', 'card-body justify-content-center');
  hHighCardBody.textContent = "--";
  hLowCard.setAttribute('class', 'card m-2 p-2');
  hLowCardHeader.setAttribute('class', 'card-header');
  hLowCardHeader.textContent = "Humidity Low";
  hLowCardBody.setAttribute('class', 'card-body justify-content-center');
  hLowCardBody.textContent = "--";

  view.setAttribute('class', 'fa-solid fa-eye btn btn-outline-primary m-2');
  view.setAttribute('data-bs-target', '#view-experiment-modal');
  view.setAttribute('data-bs-toggle', 'modal');
  edit.setAttribute('class', 'fa-solid fa-pen-to-square btn btn-outline-dark m-2');
  edit.setAttribute('data-bs-target', '#edit-experiment-modal');
  edit.setAttribute('data-bs-toggle', 'modal');
  trash.setAttribute('class', 'fa-solid fa-trash btn btn-outline-danger m-2');
  trash.setAttribute('data-bs-target', '#delete-experiment-modal');
  trash.setAttribute('data-bs-toggle', 'modal');

  experimentListGroup.append(listItem);
  listItem.append(experimentName);
  listItem.append(thresholdDiv);
  thresholdDiv.append(tHighCard);
  tHighCard.append(tHighCardHeader);
  tHighCard.append(tHighCardBody);
  thresholdDiv.append(tLowCard);
  tLowCard.append(tLowCardHeader);
  tLowCard.append(tLowCardBody);
  thresholdDiv.append(hHighCard);
  hHighCard.append(hHighCardHeader);
  hHighCard.append(hHighCardBody);
  thresholdDiv.append(hLowCard);
  hLowCard.append(hLowCardHeader);
  hLowCard.append(hLowCardBody);
  listItem.append(icons);
  icons.append(view);
  icons.append(edit);
  icons.append(trash);
}

renderExperimentCards();
// Attach each card to a list-group to be listed in the experiments card-body
