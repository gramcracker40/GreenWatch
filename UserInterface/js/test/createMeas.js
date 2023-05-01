import { GreenhouseProxy } from "../../api/api.js";

const proxy = new GreenhouseProxy();

async function createMeasurements() {
  const measurements = [
    {
      "light": 2.25,
      "temperature": 82.64,
      "pressure": 1002.97,
      "humidity": 82.53
    },
    {
      "light": 1.94,
      "temperature": 88.08,
      "pressure": 1013.17,
      "humidity": 55.73
    },
    {
      "light": 3.7,
      "temperature": 84.41,
      "pressure": 1014.88,
      "humidity": 77.48
    },
    {
      "light": 2.25,
      "temperature": 69.77,
      "pressure": 1015.53,
      "humidity": 79.99
    },
    {
      "light": 2.9,
      "temperature": 65.72,
      "pressure": 1013.77,
      "humidity": 81.97
    },
    {
      "light": 3.39,
      "temperature": 85.84,
      "pressure": 1015.94,
      "humidity": 99.53
    },
    {
      "light": 3.45,
      "temperature": 99.89,
      "pressure": 1016.65,
      "humidity": 57.08
    },
    {
      "light": 3.13,
      "temperature": 63.97,
      "pressure": 1014.05,
      "humidity": 72.4
    },
    {
      "light": 2.09,
      "temperature": 69.55,
      "pressure": 1009.75,
      "humidity": 62.97
    },
    {
      "light": 3.85,
      "temperature": 59.34,
      "pressure": 1014.63,
      "humidity": 88.87
    }
  ]

  var counter = 1;

  var interval = setInterval(function() { 
  if (counter <= 10) { 
      proxy.createMeasurement(1, measurements[counter-1]);
      console.log(measurements[counter-1]);
      counter++;
  }
  else { 
      clearInterval(interval);
  }
  }, 5000);
}

async function createSingleMeasurement() {
  const proxy = new GreenhouseProxy();

  const measurement = {
      "humidity": 88,
      "temperature": 83,
      "light": 240,
      "pressure": 1014.17
  }

  console.log(measurement);
  proxy.createMeasurement(1, measurement);
}

const createMeasButton = document.getElementById('create-meas-button');
if (createMeasButton) {
  createMeasButton.addEventListener('click', createMeasurements);
}