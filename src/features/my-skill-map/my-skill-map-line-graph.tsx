import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getMySkillMapRatings } from "@redux/slices/user-slice"
import { type MySkillMap } from "@custom-types/my-skill-map-type"
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
import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export const MySkillMapLineGraph = () => {
  const appDispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { my_skill_map } = useAppSelector((state) => state.user)

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
    if (user !== null) {
      void appDispatch(getMySkillMapRatings(user.id))
    }
  }, [user])

  useEffect(() => {
    if (my_skill_map?.length !== 0) {
      processData(my_skill_map)
    }
  }, [my_skill_map])

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r}, ${g}, ${b})`
  }

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

  if (user == null) {
    return <div>No user</div>
  }

  return <Line options={options} data={data} />
}
