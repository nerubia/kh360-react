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
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getUserSkillMap } from "@redux/slices/users-slice"
import { type UserSkillMap } from "@custom-types/user-type"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface CustomLineGraphProps {
  userId?: number
}

export const CustomLineGraph = ({ userId }: CustomLineGraphProps) => {
  const appDispatch = useAppDispatch()
  const { user_skill_map } = useAppSelector((state) => state.users)

  const [options] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let rating = "No rating"
            const rawValue = context.raw
            if (rawValue === 1) {
              rating = "Beginner"
            }
            if (rawValue === 2) {
              rating = "Intermediate"
            }
            if (rawValue === 3) {
              rating = "Expert"
            }
            return `${context.dataset.label}: ${rating}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 3,
        labels: ["No rating", "Beginner", "Intermediate", "Expert"],
        ticks: {
          stepSize: 1,
          callback: function (value) {
            if (value === 1) {
              return "Beginner"
            }
            if (value === 2) {
              return "Intermediate"
            }
            if (value === 3) {
              return "Expert"
            }
            return "No rating"
          },
        },
      },
    },
  })

  const [data, setData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    if (userId !== undefined) {
      void appDispatch(getUserSkillMap(userId))
    }
  }, [userId])

  useEffect(() => {
    if (user_skill_map.length > 0) {
      processData(user_skill_map)
    }
  }, [user_skill_map])

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r}, ${g}, ${b})`
  }

  const processData = (apiData: UserSkillMap[]) => {
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
          if (rating.skills !== undefined && rating.answer_options !== undefined) {
            const skillName = rating.skills.name
            if (skillData[skillName] === undefined || skillData[skillName] === null) {
              skillData[skillName] = new Array(apiData.length).fill(0)
            }
            let parsedRating = 0
            if (rating.answer_options.name === "Beginner") {
              parsedRating = 1
            }
            if (rating.answer_options.name === "Intermediate") {
              parsedRating = 2
            }
            if (rating.answer_options.name === "Expert") {
              parsedRating = 3
            }
            skillData[skillName][index] = parsedRating
          }
        })
      })
    })
    setData({
      labels,
      datasets: Object.keys(skillData).map((skillName) => {
        const randomColor = getRandomColor()
        return {
          label: skillName,
          data: skillData[skillName],
          backgroundColor: randomColor,
          borderColor: randomColor,
        }
      }),
    } satisfies ChartData<"line">)
  }

  return <Line options={options} data={data} />
}
