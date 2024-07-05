import { CustomLineGraph } from "@components/ui/linegraph/custom-line-graph"
import { CustomSelect } from "@components/ui/select/custom-select"
import { type Option } from "@custom-types/optionType"
import { type UserSkillMap } from "@custom-types/user-type"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { setSelectedSkillMapAdminId } from "@redux/slices/users-slice"
import { getRandomColor } from "@utils/colors"
import { convertToMonthAndYear } from "@utils/format-date"
import { sortAnswerOptionBySequenceNumber } from "@utils/sort"
import { type ChartData } from "chart.js"
import { useEffect, useState } from "react"

export const SkillMapResultsGraph = () => {
  const appDispatch = useAppDispatch()
  const { user_skill_map, selectedSkillMapAdminId } = useAppSelector((state) => state.users)

  const { answer_options } = useAppSelector((state) => state.answerOptions)

  const [scaleYLabels, setScaleYLabels] = useState<string[]>([])
  const [data, setData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  })

  const [filterOptions, setFilterOptions] = useState<Option[]>([])

  useEffect(() => {
    const answerOptions = [...answer_options]
    const answerLabels = sortAnswerOptionBySequenceNumber(answerOptions).map(
      (answerOption) => answerOption.name
    )
    answerLabels.unshift("No rating")
    setScaleYLabels(answerLabels)
  }, [answer_options])

  useEffect(() => {
    if (user_skill_map.length > 0) {
      const options = user_skill_map
        .filter((s) => s.skill_map_results.length > 0)
        .map((skillMap) => {
          return {
            label:
              `${convertToMonthAndYear(skillMap.skill_map_period_end_date ?? "")} - ${
                skillMap.name
              }` ?? "",
            value: skillMap.id.toString(),
          }
        })
      options.unshift({
        label: "All",
        value: "all",
      })
      setFilterOptions(options)
      const filteredSkillMaps =
        selectedSkillMapAdminId === "all"
          ? user_skill_map
          : user_skill_map.filter((skillMap) => skillMap.id === parseInt(selectedSkillMapAdminId))

      processData(
        filteredSkillMaps.filter((useSkillMap) => useSkillMap.skill_map_results.length !== 0)
      )
    }
  }, [user_skill_map, selectedSkillMapAdminId])

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
          if (rating.skills !== undefined) {
            const skillName = rating?.other_skill_name ?? rating.skills?.name
            if (skillData[skillName] === undefined || skillData[skillName] === null) {
              skillData[skillName] = new Array(apiData.length).fill(0)
            }
            skillData[skillName][index] = scaleYLabels.indexOf(
              rating.answer_options?.name ?? "No rating"
            )
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

  return (
    <div>
      <div className='w-[800px]'>
        <div className='flex justify-end'>
          <CustomSelect
            data-test-id='SkillMapAdminFilter'
            label='Skill Map Admin'
            name='skill_map_admin'
            value={filterOptions.find(
              (option) => option.value === selectedSkillMapAdminId.toString()
            )}
            onChange={(option) => appDispatch(setSelectedSkillMapAdminId(option?.value))}
            options={filterOptions}
          />
        </div>
        <CustomLineGraph scaleYLabels={scaleYLabels} data={data} />
      </div>
    </div>
  )
}
