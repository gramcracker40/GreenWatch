const { Chart } = require("chart.js");
import { Chart } from "chart.js/dist";

const xValues = [];
const yValues = [40,50,60,70,80,90,100,110];

new Chart("line-chart", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            data: yValues
        }]
    },
});

// here should be where we actually pull the data into the charts
// in order to show accurate measurements
fetch('/api/experiment-data')
  .then(response => response.json())
  .then(data => {
    // Extract data for the chart
    const labels = data.labels;
    const temperatureData = data.temperatureData;
    const humidityData = data.humidityData;

    // Update the chart with the new data
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = temperatureData;
    myChart.data.datasets[1].data = humidityData;
    myChart.update();
  })
  .catch(error => console.error(error));
