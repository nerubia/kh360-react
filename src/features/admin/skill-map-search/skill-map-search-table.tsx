import { useEffect, useState, Suspense, type ReactNode } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Pagination } from "@components/shared/pagination/pagination"
import { columns } from "@custom-types/skill-map-search-type"
import { getSkillMapSearch } from "@redux/slices/skill-map-search-slice"
import { Table } from "@components/ui/table/table"
import SkillMapResultsDialog from "../skill-map-results/skill-map-results-dialog"
import { convertToMonthAndYear, convertToFullDate } from "@utils/format-date"
import { type SkillMapRating } from "@custom-types/skill-map-rating-type"
import { getAnswerOptionsByType } from "@redux/slices/answer-options-slice"
import { type ChartData } from "chart.js"
import { sortAnswerOptionBySequenceNumber } from "@utils/sort"
import { CustomLineGraph } from "@components/ui/linegraph/custom-line-graph"
import { getUserSkillMapBySkillId, setUserSkillMap } from "@redux/slices/users-slice"
import { type UserSkillMap } from "@custom-types/user-type"
import { getRandomColor } from "@utils/colors"

export const SkillMapSearchTable = () => {
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { skill_map_ratings, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.skillMapSearch
  )
  const { answer_options } = useAppSelector((state) => state.answerOptions)
  const { user_skill_map } = useAppSelector((state) => state.users)

  const [showSkillMapModal, setShowSkillMapModal] = useState<boolean>(false)
  const [selectedSkillMapRating, setSelectedSkillMapRating] = useState<SkillMapRating | null>(null)

  const [scaleYLabels, setScaleYLabels] = useState<string[]>([])
  const [data, setData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    void appDispatch(getAnswerOptionsByType("Skill Map Scale"))
  }, [])

  useEffect(() => {
    void appDispatch(
      getSkillMapSearch({
        name: searchParams.get("name") ?? undefined,
        skill: searchParams.get("skill") ?? undefined,
        sortBy: searchParams.get("sortBy") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

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
      const filteredUserSkillMap = user_skill_map.filter(
        (userSkillMap) => userSkillMap.skill_map_results[0].skill_map_ratings.length !== 0
      )
      processData(filteredUserSkillMap)
    }
  }, [user_skill_map])

  const toggleSkillMapModal = () => {
    const previousState = showSkillMapModal
    setShowSkillMapModal((prev) => !prev)
    if (previousState) {
      void appDispatch(setUserSkillMap([]))
    }
  }

  const handleRowClick = (id: number) => {
    const skillMapRating = skill_map_ratings.find((skillMapRating) => skillMapRating.id === id)
    if (skillMapRating !== undefined) {
      setSelectedSkillMapRating(skillMapRating)
      const userId = skillMapRating.skill_map_results?.users?.id
      const skillId = skillMapRating.skills?.id
      if (userId !== undefined && skillId !== undefined) {
        void appDispatch(
          getUserSkillMapBySkillId({
            id: userId,
            skillId,
          })
        )
      }
    }
  }

  const renderCell = (item: SkillMapRating, column: ReactNode): ReactNode => {
    const columnName = column as string
    switch (columnName) {
      case "Name":
        return `${item.skill_map_results?.users?.last_name}, ${item.skill_map_results?.users?.first_name}`
      case "Skill":
        return item.skills?.name
      case "Latest Rating":
        return item.answer_options?.name
      case "Details":
        return (
          <div>
            <p className='text-sm'>
              Period Date:{" "}
              {convertToMonthAndYear(
                item?.skill_map_administrations?.skill_map_period_end_date ?? ""
              )}
            </p>
            <p className='text-sm'>
              Submitted Date:{" "}
              {convertToFullDate(item.skill_map_results?.submitted_date?.toString() ?? "")}
            </p>
          </div>
        )
      default:
        return ""
    }
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
            skillData[skillName][index] = scaleYLabels.indexOf(rating.answer_options.name)
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

    toggleSkillMapModal()
  }

  return (
    <>
      <div className='flex flex-col gap-8 overflow-x-auto'>
        <Table
          columns={columns}
          data={skill_map_ratings}
          isRowClickable={true}
          renderCell={renderCell}
          onClickRow={handleRowClick}
        />
        {totalPages !== 1 && (
          <div className='flex justify-center'>
            <Pagination
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
      <Suspense>
        <SkillMapResultsDialog
          open={showSkillMapModal}
          title={`${selectedSkillMapRating?.skill_map_results?.users?.last_name}, ${selectedSkillMapRating?.skill_map_results?.users?.first_name}: ${selectedSkillMapRating?.skills?.name} Skill Map Details`}
          description={
            <div className='w-[800px]'>
              <CustomLineGraph scaleYLabels={scaleYLabels} data={data} />
            </div>
          }
          onSubmit={toggleSkillMapModal}
        />
      </Suspense>
    </>
  )
}
