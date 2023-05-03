import { GreenhouseProxy } from "../api/api.js";
import * as Utils from "../js/utilities.js";

const proxy = new GreenhouseProxy();

const roomID = sessionStorage.getItem('roomID');

const updateChartButton = document.getElementById('update-chart');
updateChartButton.addEventListener('click', renderMeasurements);

const chartSelector = document.getElementById('chart-selector');
chartSelector.addEventListener('click', renderMeasurements);

const exportDataBtn = document.getElementById('export-data-btn');
exportDataBtn.disabled = true;

async function renderMeasurements() {
  // console.log("Rendering measurements...");
  
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  let isDateNull = false;
  let measurements = []

  const dateObj = {
    "end_date": `${endDate.value}`,
    "start_date": `${startDate.value}`
  }

  // Need to ensure that the dates aren't null
  for (const date in dateObj) {
    // console.log(dateObj[date]);
    if (dateObj[date] == "") {
      isDateNull = true;
    }
  }

  // Get measurements for roomID stored in session storage
  if (!isDateNull) {
    const measurementsObj = await proxy.getMeasurementByRoom(roomID, dateObj);
    measurements = measurementsObj['data'];
    // console.log(measurements);

    if (measurements.length) {
      // Enable export data button
      exportDataBtn.disabled = false;
      exportDataBtn.addEventListener('click', () => {
        const csvData = Utils.csvMaker(measurements);
        // console.log(csvData);

        Utils.download(csvData['csv_data'], csvData['file_name']);
      });

      let dates = [];
      let t_data = [];
      let h_data = [];
      let p_data = [];
      let l_data = [];
  
      measurements.forEach(measurement => {
        var date = new Date(measurement['timestamp']);
        const day = date.getUTCDate();
        const month = date.getUTCMonth();
        const hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        let seconds = date.getUTCSeconds();
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
        const timestamp = `${Utils.months[month]} ${day} ${Utils.toStandardTime(hours)['hours']}:${minutes}:${seconds}`;
        dates.push(timestamp);
  
        const temperatureValue = measurement['temperature'];
        t_data.push(temperatureValue);
  
        const humidityValue = measurement['humidity'];
        h_data.push(humidityValue);
  
        const pressureValue = measurement['pressure'];
        p_data.push(pressureValue);
  
        const lightValue = measurement['light'];
        l_data.push(lightValue);
      });
  
      // Debug Lines
      // console.log("Temperature:\n" + t_data);
      // console.log("Humidity:\n" + h_data);
      // console.log("Pressure:\n" + p_data);
      // console.log("Light:\n" + l_data);
      // console.log("Timestamps:\n" + dates);    
  
      switch(parseInt(chartSelector.value)) {
        case 1: 
          updateChart(dates, t_data, 'Temperature');
          break;
        case 2:
          updateChart(dates, h_data, 'Humidity');
          break;
        case 3:
          updateChart(dates, p_data, 'Pressure');
          break;
        case 4:
          updateChart(dates, l_data, 'Light');
          break;
        default:
          // remove current canvas element if one exist
          const canvasDiv = document.getElementById('canvas-div');
          if(canvasDiv.firstChild) {
            canvasDiv.removeChild(canvasDiv.lastChild);
          }
          
          // create canvas element
          const canvasElement = document.createElement('canvas');
          canvasElement.setAttribute('id', 'main-chart');
          canvasDiv.append(canvasElement);
          
          // create chart variable
          var chart = new Chart(canvasElement, {
            type: 'line',
            data: {
              labels: dates,
              datasets: [
                {
                label: 'Temperature',
                data: t_data,
                borderWidth: 1
                },
                {
                  label: 'Humidity',
                  data: h_data,
                  borderWidth: 1
                },
                {
                  label: 'Pressure',
                  data: p_data,
                  borderWidth: 1
                },
                {
                  label: 'Light',
                  data: l_data,
                  borderWidth: 1
                }
              ]
            },
            options: {
              animation: false,
              aspectRatio: 1.5,
              scales: {
                y: {
                  beginAtZero: false,
                }
              }
            }
          });
      }
    }else{
      createPlaceholderChart('No Measurement Data Available');
    }
  }
}

function updateChart(dates, data, key) {
  // remove current canvas element if one exist
  const canvasDiv = document.getElementById('canvas-div');
  if(canvasDiv.firstChild) {
    canvasDiv.removeChild(canvasDiv.lastChild);
  }

  // create canvas element
  const canvasElement = document.createElement('canvas');
  canvasElement.setAttribute('id', 'main-chart');
  canvasDiv.append(canvasElement);

  // create chart variable
  var chart = new Chart(canvasElement, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
         label: key,
         data: data,
         borderWidth: 1
        }
      ]
    },
    options: {
      animation: false,
      aspectRatio: 1.5,
      scales: {
        y: {
          beginAtZero: false,
        }
      }
    }
  });
}

function createPlaceholderChart(key) {
  const labels = [1,2,3,4,5];
  const data = [];
  updateChart(labels, data, key);
}

createPlaceholderChart('N/A');

renderMeasurements();
