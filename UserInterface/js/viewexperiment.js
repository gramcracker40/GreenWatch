// Define the URL of the API endpoint for fetching experiment data
const apiEndpoint = '/api/experiments';

// Define the ID of the experiment you want to view
const experimentId = 123;

// Define a function to populate the view experiment modal with experiment data
async function populateViewExperimentModal() {
  const experimentData = await fetchExperimentData();

  // Populate the temperature low value
  const temperatureLowElement = document.querySelector('#view-experiment-modal .temperature-low');
  temperatureLowElement.textContent = experimentData.temperatureLow;

  // Populate the temperature high value
  const temperatureHighElement = document.querySelector('#view-experiment-modal .temperature-high');
  temperatureHighElement.textContent = experimentData.temperatureHigh;

  // Populate the humidity low value
  const humidityLowElement = document.querySelector('#view-experiment-modal .humidity-low');
  humidityLowElement.textContent = experimentData.humidityLow;

  // Populate the humidity high value
  const humidityHighElement = document.querySelector('#view-experiment-modal .humidity-high');
  humidityHighElement.textContent = experimentData.humidityHigh;

  // Populate the average temperature value
  const averageTemperatureElement = document.querySelector('#view-experiment-modal .average-temperature');
  averageTemperatureElement.textContent = experimentData.averageTemperature;

  // Populate the average humidity value
  const averageHumidityElement = document.querySelector('#view-experiment-modal .average-humidity');
  averageHumidityElement.textContent = experimentData.averageHumidity;

  // Populate the start date value
  const startDateElement = document.querySelector('#view-experiment-modal .start-date');
  startDateElement.textContent = experimentData.startDate;

  // Populate the end date value
  const endDateElement = document.querySelector('#view-experiment-modal .end-date');
  endDateElement.textContent = experimentData.endDate;

  // Populate the details value
  const detailsElement = document.querySelector('#view-experiment-modal .details');
  detailsElement.textContent = experimentData.details;
}

// Add an event listener to the view experiment button to open the view experiment modal and populate it with data when clicked
const viewExperimentButton = document.querySelector('#experiments-section .card-body');
viewExperimentButton.addEventListener('click', () => {
  const viewExperimentModal = document.querySelector('#view-experiment-modal');
  const bootstrapModal = new bootstrap.Modal(viewExperimentModal);
  bootstrapModal.show();
  populateViewExperimentModal();
});
