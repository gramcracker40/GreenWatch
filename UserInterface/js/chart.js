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