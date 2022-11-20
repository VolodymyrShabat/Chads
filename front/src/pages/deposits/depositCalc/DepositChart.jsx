import React from "react"
import { Doughnut } from "react-chartjs-2"

function DepositChart({ depositAmount, totalProfit }) {
  const data = {
    labels: ["Deposit amount", "Profit from deposit"],
    datasets: [
      {
        data: [depositAmount, totalProfit],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    animation: {
      animateRotate: false,
    },
  }
  return (
    <div>
      <Doughnut data={data} options={options} />
    </div>
  )
}

export default React.memo(DepositChart)
