import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getMySkillMapRatings } from "@redux/slices/user-slice"
import { type MySkillMap } from "@custom-types/my-skill-map-type"
import { type ChartData } from "chart.js"
import { useEffect, useState } from "react"
import { getAnswerOptionsByType } from "@redux/slices/answer-options-slice"
import { sortAnswerOptionBySequenceNumber, sortMySkillMapByPeriodEndDate } from "@utils/sort"
import { CustomLineGraph } from "@components/ui/linegraph/custom-line-graph"
import { getRandomColor } from "@utils/colors"
import { PageSubTitle } from "@components/shared/page-sub-title"
import { convertToMonthAndYear } from "@utils/format-date"

export const MySkillMapLineGraph = () => {
  const appDispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const { answer_options } = useAppSelector((state) => state.answerOptions)
  const { my_skill_map, selectedSkillMapAdminId } = useAppSelector((state) => state.user)

  const [scaleYLabels, setScaleYLabels] = useState<string[]>([])
  const [scaleXLabels, setScaleXLabels] = useState<string[]>([])
  const [data, setData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    if (user !== null) {
      void appDispatch(getAnswerOptionsByType("Skill Map Scale"))
      void appDispatch(getMySkillMapRatings(user.id))
    }
  }, [user])

  useEffect(() => {
    const answerOptions = [...answer_options]
    const answerLabels = sortAnswerOptionBySequenceNumber(answerOptions).map(
      (answerOption) => answerOption.name
    )
    answerLabels.unshift("No rating")
    setScaleYLabels(answerLabels)
  }, [answer_options])

  useEffect(() => {
    if (scaleYLabels.length !== 0 && my_skill_map?.length !== 0) {
      const filteredSkillMaps =
        selectedSkillMapAdminId === "all"
          ? my_skill_map
          : my_skill_map.filter((skillMap) => skillMap.id === parseInt(selectedSkillMapAdminId))
      const skillMaps = filteredSkillMaps
        .map((skillMap) => skillMap.name)
        .filter((name): name is string => name !== undefined)
      setScaleXLabels(skillMaps)
      processData(filteredSkillMaps)
    }
  }, [scaleYLabels, my_skill_map, selectedSkillMapAdminId])

  const processData = (apiData: MySkillMap[]) => {
    const labels = apiData.map(
      (item) =>
        item.skill_map_period_end_date != null &&
        `${new Date(item.skill_map_period_end_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        })}`
    )

    const skillData: Record<string, Array<number | null>> = {}
    apiData.forEach((item, index) => {
      item.skill_map_results.forEach((result) => {
        result.skill_map_ratings.forEach((rating) => {
          const skillName = rating?.other_skill_name ?? rating?.skills?.name

          if (skillData[skillName] === undefined || skillData[skillName] === null) {
            skillData[skillName] = new Array(apiData.length).fill(0)
          }
          skillData[skillName][index] = scaleYLabels.indexOf(rating.answer_options.name)
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

  const filteredSkillMap = sortMySkillMapByPeriodEndDate(my_skill_map)

  return (
    <>
      <CustomLineGraph scaleYLabels={scaleYLabels} scaleXLabels={scaleXLabels} data={data} />
      <PageSubTitle>Comments</PageSubTitle>
      {filteredSkillMap.map((skillMap, index) => (
        <div key={index} className='text-sm xl:text-md italic'>
          <p className='capitalize'>
            {"- "}
            {skillMap.skill_map_results[0].comments}
            <span> </span>
            {`(${convertToMonthAndYear(skillMap.skill_map_period_end_date ?? "")})`}
          </p>
        </div>
      ))}
    </>
  )
}
