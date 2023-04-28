// const { Chart } = require("chart.js");
// import Chart from "/dist/chart.umd.min.js";
import { GreenhouseProxy } from "../api/api.js";

const proxy = new GreenhouseProxy();

const roomID = sessionStorage.getItem('roomID');

const updateChartButton = document.getElementById('update-chart');
updateChartButton.addEventListener('click', renderMeasurements);

// Aquire measurement data and store in object

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

  console.log(isDateNull);
  // Get measurements for roomID stored in session storage
  if (!isDateNull) {
    const measurementsObj = await proxy.getMeasurementByRoom(1, dateObj);
    measurements = measurementsObj['data'];
    console.log(measurements);
    let labels = [];
    let t_data = [];
    let h_data = [];
    let p_data = [];
    let l_data = [];

    measurements.forEach(measurement => {
      var date = new Date(measurement['timestamp']);
      const day = date.getUTCDate();
      const month = date.getUTCMonth();
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const seconds = date.getUTCSeconds();
      const timestamp = `${day} ${month} ${hours}:${minutes}:${seconds}`
      labels.push(timestamp);

      const temperatureValue = measurement['temperature'];
      t_data.push(temperatureValue);

      const humidityValue = measurement['humidity'];
      h_data.push(humidityValue);

      const pressureValue = measurement['pressure'];
      p_data.push(pressureValue);

      const lightValue = measurement['light'];
      l_data.push(lightValue);
    });

    console.log("Temperature:\n" + t_data);
    console.log("Humidity:\n" + h_data);
    console.log("Pressure:\n" + p_data);
    console.log("Light:\n" + l_data);
    console.log("Timestamps:\n" + labels);
  }

}

function updateChart() {
  const ctx = document.getElementById('myChart');

  var chart = new Chart(ctx, {
    type: 'line',
    // data: {
    //   labels: labels,
    //   datasets: [
    //   {
    //     label: 'Temperature',
    //     data: t_data,
    //     borderWidth: 1
    //   },
    //   {
    //     label: 'Humidity',
    //     data: h_data,
    //     borderWidth: 1
    //   },
    //   {
    //     label: 'Pressure',
    //     data: p_data,
    //     borderWidth: 1
    //   },
    //   {
    //     label: 'Light',
    //     data: l_data,
    //     borderWidth: 1
    //   }
    // ]
    // },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        }
      }
    }
  });

  
  chart.data.datasets = {
    // label: 'Temperature',
    data: t_data,
    borderWidth: 1
  }
}

renderMeasurements();

const chartSelector = document.getElementById('chart-selector');
chartSelector.addEventListener('click', renderMeasurements);