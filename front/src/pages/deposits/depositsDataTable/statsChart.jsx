import React from "react"
import { Doughnut, Chart } from "react-chartjs-2"
import ChartDataLabels from "chartjs-plugin-datalabels"

Chart.register({
  ChartDataLabels,
})

function StatChart({ economSum, fastSum, standartSum }) {
  const data = {
    labels: ["ECONOM", "FAST", "STANDART"],
    datasets: [
      {
        data: [economSum, fastSum, standartSum],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(0,250,154, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(0,250,154, 1)",
        ],
        borderWidth: 1,
        hoverOffset: 2,
      },
    ],
  }

  const options = {
    animation: {
      animateRotate: true,
    },
  }
  return (
    <div>
      <Doughnut data={data} options={options} />
    </div>
  )
}

export default React.memo(StatChart)
