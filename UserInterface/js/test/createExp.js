import { GreenhouseProxy } from "../../api/api.js";

const proxy = new GreenhouseProxy();

async function createExperiments() {
  const experiments = [
    {
      "alert_on": true,
      "name": "Lindberg's Hypnum Moss",
      "lower_temp": 89,
      "lower_hum": 66,
      "upper_hum": 53,
      "upper_temp": 86,
      "end": "2023-07-05T04:05:27Z",
      "start": "2023-05-22T11:19:38Z",
      "room_id": 1
    },
    {
      "alert_on": false,
      "name": "Wisconsin Dewberry",
      "lower_temp": 77,
      "lower_hum": 100,
      "upper_hum": 95,
      "upper_temp": 86,
      "end": "2023-07-02T13:11:12Z",
      "start": "2023-05-23T21:02:16Z",
      "room_id": 1
    },
    {
      "alert_on": true,
      "name": "Western Meadow-rue",
      "lower_temp": 89,
      "lower_hum": 99,
      "upper_hum": 52,
      "upper_temp": 94,
      "end": "2023-07-23T10:51:03Z",
      "start": "2023-05-07T11:30:18Z",
      "room_id": 1
    },
    {
      "alert_on": true,
      "name": "Black Peppermint",
      "lower_temp": 73,
      "lower_hum": 56,
      "upper_hum": 90,
      "upper_temp": 51,
      "end": "2023-07-26T06:18:18Z",
      "start": "2023-05-24T18:30:19Z",
      "room_id": 1
    },
    {
      "alert_on": false,
      "name": "Slim Milkweed",
      "lower_temp": 87,
      "lower_hum": 52,
      "upper_hum": 58,
      "upper_temp": 83,
      "end": "2023-07-16T11:14:19Z",
      "start": "2023-05-16T23:27:10Z",
      "room_id": 1
    },
    {
      "alert_on": true,
      "name": "Horehound",
      "lower_temp": 71,
      "lower_hum": 75,
      "upper_hum": 77,
      "upper_temp": 66,
      "end": "2023-07-21T21:30:14Z",
      "start": "2023-05-25T13:10:02Z",
      "room_id": 1
    },
    {
      "alert_on": false,
      "name": "Pricklyleaf",
      "lower_temp": 66,
      "lower_hum": 74,
      "upper_hum": 79,
      "upper_temp": 71,
      "end": "2023-07-10T18:43:54Z",
      "start": "2023-05-02T23:31:29Z",
      "room_id": 1
    },
    {
      "alert_on": false,
      "name": "Sickletop Lousewort",
      "lower_temp": 53,
      "lower_hum": 76,
      "upper_hum": 98,
      "upper_temp": 63,
      "end": "2023-07-19T05:41:13Z",
      "start": "2023-04-29T06:18:36Z",
      "room_id": 1
    },
    {
      "alert_on": true,
      "name": "Niterwort",
      "lower_temp": 58,
      "lower_hum": 64,
      "upper_hum": 74,
      "upper_temp": 75,
      "end": "2023-07-16T09:02:46Z",
      "start": "2023-05-04T09:44:38Z",
      "room_id": 1
    },
    {
      "alert_on": false,
      "name": "Bigelow's Beggarticks",
      "lower_temp": 53,
      "lower_hum": 72,
      "upper_hum": 74,
      "upper_temp": 56,
      "end": "2023-07-06T18:56:47Z",
      "start": "2023-05-23T11:23:53Z",
      "room_id": 1
    }
  ]

  experiments.forEach(experiment => {
    proxy.createExpirement(experiment);
  });
}

async function createSingleExperiment() {
  const experiment = {
    "alert_on": false,
      "name": "Bigelow's Beggarticks",
      "lower_temp": 52,
      "lower_hum": 73,
      "upper_hum": 78,
      "upper_temp": 59,
      "end": "2023-07-06T18:59:48",
      "start": "2023-05-23T11:27:52",
      "room_id": 1
  }

  proxy.createExpirement(experiment);
}

const createExpButton = document.getElementById('create-exp-button');
if (createExpButton) {
  createExpButton.addEventListener('click', createSingleExperiment);
}