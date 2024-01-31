import React from "react"
import { Scatter } from "react-chartjs-2"
import { type TooltipItem, type ChartType, type ScriptableContext } from "chart.js/auto"
import { type User } from "@custom-types/user-type"
import { formatDateRange } from "@utils/format-date"

interface DistributionChartProps {
  evaluator: User
  currentEvaluee: User
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  evaluator,
  currentEvaluee,
}) => {
  if (evaluator.evaluations !== undefined) {
    const uniqueValues: Record<number, number> = {}
    const evalueeData = evaluator.evaluations?.map((evaluation) => {
      const value = evaluation.zscore ?? 0

      if (uniqueValues[value] !== undefined) {
        uniqueValues[value] += 0.25
      } else {
        uniqueValues[value] = 0
      }
      return {
        value: evaluation.zscore,
        yValue: uniqueValues[value],
        name: `${evaluation.evaluee?.last_name}, ${evaluation.evaluee?.first_name}`,
        project: evaluation.project,
        projectRole: evaluation.project_role,
        period: formatDateRange(evaluation.eval_start_date, evaluation.eval_end_date),
      }
    })
    const getBarColor = (): ((context: ScriptableContext<"line">) => string) => {
      return (context: ScriptableContext<"line">) => {
        let color = ""
        if (context.raw !== undefined) {
          const evalueeName = (context.raw as { label: string }).label ?? ""
          const currentEvalueeName = `${currentEvaluee.last_name}, ${currentEvaluee.first_name}`
          color = evalueeName === currentEvalueeName ? "#a78ec8" : "#e7e2f2"
        }
        return color
      }
    }

    const chartData = {
      datasets: [
        {
          label: "Evaluee Data",
          data: evalueeData?.map((evaluee) => ({
            x: evaluee.value,
            y: evaluee.yValue,
            label: evaluee.name,
          })),
          borderColor: "transparent",
          pointRadius: 7,
          pointHoverRadius: 10,
          pointBackgroundColor: getBarColor(),
        },
      ],
    }
    const chartOptions = {
      interaction: {
        intersect: true,
        mode: "nearest" as const,
      },
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: 4,
      scales: {
        x: {
          min: -2,
          max: 2,
          beginAtZero: false,
          ticks: {
            display: true,
          },
          grid: {
            color: (context: { tick: { value: number } }) => {
              return context.tick.value === 0 ? "#f2f2f2" : "transparent"
            },
          },
        },
        y: {
          clip: false,
          display: false,
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          padding: 12,
          callbacks: {
            title: (context: Array<TooltipItem<ChartType>>) => {
              if (context.length > 0) {
                const firstItem = context[0]
                const index = firstItem.dataIndex
                const title = chartData.datasets[0].data[index].label
                return title ?? ""
              }
              return ""
            },
            label: (context: TooltipItem<ChartType>) => {
              const labels = []
              const index = context.dataIndex
              const project = evalueeData[index].project
              const projectRole = evalueeData[index].projectRole
              const period = evalueeData[index].period

              if (project !== null) {
                labels.push(`${project?.name} [${projectRole?.short_name}]`)
              }

              labels.push(`${period}`, `Zscore: ${context.parsed.x}`)

              return labels
            },
          },
          displayColors: false,
        },
        legend: {
          display: false,
        },
      },
    }

    return (
      <div className='md:w-[750px]'>
        <Scatter data={chartData} options={chartOptions} />
      </div>
    )
  }
}
