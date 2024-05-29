import React, { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import "chart.js/auto"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getMySkillMapRatings } from "@redux/slices/user-slice"
import { type MySkillMap } from "@custom-types/my-skill-map-type"
import { type ChartOptions, type TooltipItem } from "chart.js"

interface SkillMapChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: Array<number | null>
    fill: boolean
    borderColor: string
    tension: number
  }>
}

interface UserProp {
  id: number
}

export const LineGraph = ({ id }: UserProp) => {
  const dispatch = useAppDispatch()
  const { my_skill_map, error } = useAppSelector((state) => state.user)
  const [chartData, setChartData] = useState<SkillMapChartData>({ labels: [], datasets: [] })

  useEffect(() => {
    void dispatch(getMySkillMapRatings(id))
  }, [dispatch])

  useEffect(() => {
    if (my_skill_map?.length !== 0) {
      const data = processData(my_skill_map)
      setChartData(data)
    }
  }, [my_skill_map])

  const processData = (apiData: MySkillMap[]) => {
    const labels = apiData.map((item) =>
      item.skill_map_period_end_date != null
        ? new Date(item.skill_map_period_end_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })
        : ""
    )

    const skillData: Record<string, Array<number | null>> = {}
    apiData.forEach((item, index) => {
      item.skill_map_results.forEach((result) => {
        result.skill_map_ratings.forEach((rating) => {
          const skillName = rating.skills.name
          if (skillData[skillName] === undefined || skillData[skillName] === null) {
            skillData[skillName] = new Array(apiData.length).fill(null)
          }
          skillData[skillName][index] = rating.answer_option_id
        })
      })
    })

    return {
      labels,
      datasets: Object.keys(skillData).map((skillName) => ({
        label: skillName,
        data: skillData[skillName],
        fill: false,
        tension: 0.4,
        borderColor: getRandomColor(),
      })),
    }
  }

  const getRandomColor = (): string => {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            let label: string = context.dataset.label ?? ""
            if (label !== "") {
              label += ": "
            }
            const value: number = context.raw as number
            if (value === 7) {
              label += "Beginner"
            } else if (value === 8) {
              label += "Intermediate"
            } else if (value === 9) {
              label += "Expert"
            } else {
              label += value.toString()
            }
            return label
          },
        },
      },
      title: {
        display: true,
        text: "Skill Progression Over Time",
      },
    },
    hover: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        min: 7,
        max: 9,
        ticks: {
          stepSize: 1,
          callback: function (tickValue: number | string): string {
            if (tickValue === 7) return "Beginner"
            if (tickValue === 8) return "Intermediate"
            if (tickValue === 9) return "Expert"
            return ""
          },
        },
      },
    },
  }

  return (
    <div>
      {error != null && <p>Error loading data</p>}
      {error == null ? <Line data={chartData} options={options} /> : <p>No data available</p>}
    </div>
  )
}
