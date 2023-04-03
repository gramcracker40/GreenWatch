// Bar and Line chart
const DATA_COUNT = 6;
const NUMBER_CFG = {count: DATA_COUNT, min: -100, max:100};

const labels = Utils.months({count: 7});
const data = {
    labels: labels,
    datasets: [
        {
            label: 'Temp',
            data: Utils.numbers(NUMBER_CFG),
            borderColor: Utils.CHART_COLORS.red,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        }
        
    ]
};