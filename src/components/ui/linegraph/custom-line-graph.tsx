import { useEffect, useRef, useState } from "react"
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
  scaleXLabels: string[]
  data: ChartData<"line">
}

export const CustomLineGraph = ({ scaleYLabels, scaleXLabels, data }: CustomLineGraphProps) => {
  const chartRef = useRef<ChartJS<"line", number[], string>>(null)
  const [options, setOptions] = useState<ChartOptions<"line">>()

  useEffect(() => {
    if (scaleYLabels.length > 0) {
      setOptions({
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: (context) => {
                if (context.length > 0) {
                  const { label, dataIndex } = context[0]
                  return `${scaleXLabels[dataIndex]} ${label}`
                }
              },
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
  }, [scaleYLabels, scaleXLabels])

  const htmlLegendPlugin = {
    id: "htmlLegend",
    afterUpdate(chart: ChartJS) {
      if (chart.options.plugins?.legend?.labels?.generateLabels != null) {
        const items = chart.options.plugins.legend.labels.generateLabels(chart)
        const ul = document.createElement("ul")
        ul.className = "flex flex-wrap justify-center gap-x-2 gap-y-1 px-1"

        items.forEach((item) => {
          const li = document.createElement("li")
          li.className = "flex flex-row items-center gap-2 cursor-pointer"

          li.onclick = () => {
            if (chartRef.current !== null) {
              chartRef.current.setDatasetVisibility(
                item.datasetIndex as number,
                !chart.isDatasetVisible(item.datasetIndex as number)
              )
              chartRef.current.update()
            }
          }

          const boxSpan = document.createElement("span")
          boxSpan.className = "w-11 h-4"
          boxSpan.style.background = item.fillStyle as string
          boxSpan.style.borderColor = item.strokeStyle as string
          boxSpan.style.borderWidth = item.lineWidth + "px"

          const textContainer = document.createElement("p")
          textContainer.className = "text-xs"
          textContainer.style.color = item.fontColor as string
          textContainer.style.textDecoration = item.hidden === true ? "line-through" : ""

          const text = document.createTextNode(item.text)
          textContainer.appendChild(text)

          li.appendChild(boxSpan)
          li.appendChild(textContainer)
          ul.appendChild(li)
        })
        const jsLegend = document.getElementById("js-legend")
        if (jsLegend !== null) {
          jsLegend.innerHTML = ""
          jsLegend.appendChild(ul)
        }
      }
    },
  }

  return (
    <div>
      <Line ref={chartRef} options={options} data={data} plugins={[htmlLegendPlugin]} />
      <div id='js-legend'></div>
    </div>
  )
}
