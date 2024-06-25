import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface CustomLineGraphProps {
  scaleYLabels: string[]
  data: ChartData<"line">
}

export const CustomLineGraph = ({ scaleYLabels, data }: CustomLineGraphProps) => {
  const [options, setOptions] = useState<ChartOptions<"line">>()

  useEffect(() => {
    if (scaleYLabels.length > 0) {
      setOptions({
        responsive: true,
        plugins: {
          legend: {
            position: "bottom" as const,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${scaleYLabels[context.raw as number]}`
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: scaleYLabels.length - 1,
            labels: scaleYLabels,
            ticks: {
              stepSize: 1,
              callback: function (value) {
                return scaleYLabels[value as number]
              },
            },
          },
        },
      })
    }
  }, [scaleYLabels])

  return <Line options={options} data={data} />
}
