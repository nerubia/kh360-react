import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getMySkillMapRatings } from "@redux/slices/user-slice"
import { type MySkillMap } from "@custom-types/my-skill-map-type"
import { getByTemplateType } from "@redux/slices/email-template-slice"

interface SkillMapChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: Array<number | null>
    borderColor: string
  }>
}

interface UserProp {
  id: number
}

export const LineGraph = ({ id }: UserProp) => {
  const appDispatch = useAppDispatch()
  const { my_skill_map, error } = useAppSelector((state) => state.user)
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)
  const [chartData, setChartData] = useState<SkillMapChartData>({ labels: [], datasets: [] })

  useEffect(() => {
    void appDispatch(getByTemplateType("No Skill Map Data"))
    void appDispatch(getMySkillMapRatings(id))
  }, [id])

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

  const idToSkillLevel: Record<number, string> = {
    7: "Beginner",
    8: "Intermediate",
    9: "Expert",
  }

  return (
    <div className='ml-10'>
      {error != null && <p>Error loading data</p>}
      {error == null && chartData.labels.length > 0 ? (
        <LineChart
          width={900}
          height={400}
          data={chartData.labels.map((label, index) => {
            const dataPoint: Record<string, unknown> = { label }
            chartData.datasets.forEach((dataset) => {
              dataPoint[dataset.label] = dataset.data[index]
            })
            return dataPoint
          })}
          margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='label' />
          <YAxis
            type='number'
            domain={[7, 9]}
            ticks={[7, 8, 9]}
            tickFormatter={(value) => ["Beginner", "Intermediate", "Expert"][value - 7]}
          />
          <Tooltip
            formatter={(value) => {
              if (
                typeof value === "number" &&
                Object.prototype.hasOwnProperty.call(idToSkillLevel, value)
              ) {
                return idToSkillLevel[value]
              }
              return value
            }}
          />
          <Legend />
          {chartData.datasets.map((dataset, index) => (
            <Line
              key={index}
              type='monotone'
              dataKey={dataset.label}
              name={dataset.label}
              stroke={dataset.borderColor}
            />
          ))}
        </LineChart>
      ) : (
        <p className='whitespace-pre-wrap'>{emailTemplate?.content}</p>
      )}
    </div>
  )
}
