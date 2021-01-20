import React, { useEffect } from "react";
import Chart from "chart.js";

export default function BarGraph(props) {
  console.log("bar graph props", props);

  useEffect(() => {

    let interval = setInterval(() => {
      console.log('refresh data');
      props.refreshData(props.refreshArg);
    }, 10000);

    return () => clearInterval(interval);
  })

  useEffect(() => {
    const canvas = document.getElementById(`myChart_${props.datapoint}`);
    const data = props.chartData[props.datapoint];

    if (data) {
      const valuesForGraph = Object.values(data);
      const colors = calculateColors();

      const ctx = canvas.getContext("2d");
      const myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: props.frameworks,
          datasets: [
            {
              label: `Number of ${props.datapoint}`,
              data: valuesForGraph,
              backgroundColor: colors,
              borderColor: colors,
              hoverBackgroundColor: colors,
              hoverBorderColor: colors,
              borderWidth: 1,
            },
          ],
        },
      });
    }
  }, [props.chartData]);

  const calculateColors = () => {

    const defaultColors = [
      "rgba(232, 232, 232, 1)", 
      "rgba(232, 232, 232, 1)",
      "rgba(232, 232, 232, 1)",
      "rgba(232, 232, 232, 1)"
    ];

    const data = props.chartData[props.datapoint];
    const successMetric = props.successMetrics[props.datapoint];
    const values = Object.values(data);

    const winningFramework = getWinningFramework(data, successMetric, values);
    const losingFramework = getLosingFramework(data, successMetric, values);

    const winningFrameworkIdx = props.frameworks.indexOf(winningFramework);
    defaultColors[winningFrameworkIdx] = "rgba(25, 250, 73, 0.5)";

    const losingFrameworkIdx = props.frameworks.indexOf(losingFramework);
    defaultColors[losingFrameworkIdx] = "rgba(255, 5, 9, 0.5)";

    return defaultColors;
  };

  const getWinningFramework = (data, successMetric, values) => {
    let winnerValue;

    if (successMetric === "lowest") {
      winnerValue = Math.min(...values);
    } else {
      winnerValue = Math.max(...values);
    }

    return findKeyFromValue(winnerValue, data);
  };

  const getLosingFramework = (data, successMetric, values) => {
    let loserValue;

    if (successMetric === 'lowest') {
      loserValue = Math.max(...values);
    } else {
      loserValue = Math.min(...values);
    }

    return findKeyFromValue(loserValue, data);
  };

  const findKeyFromValue = (value, obj) => {
    return Object.entries(obj).find(pair => pair[1] === value)[0] || false;
  };

  return <canvas id={`myChart_${props.datapoint}`} />;
}
