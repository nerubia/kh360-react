import { useEffect, useState, lazy, Suspense } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Pagination } from "@components/shared/pagination/pagination"
import { Table } from "@components/ui/table/table"
import { formatDate } from "@utils/format-date"
import { type SkillMapResult, columns } from "@custom-types/skill-map-result-type"
import { getSkillMapResultsLatest } from "@redux/slices/skill-map-results-slice"
import { CustomLineGraph } from "@components/ui/linegraph/custom-line-graph"
import { type ChartData } from "chart.js"
import { getUserSkillMap, setUserSkillMap } from "@redux/slices/users-slice"
import { type UserSkillMap } from "@custom-types/user-type"
import { getAnswerOptionsByType } from "@redux/slices/answer-options-slice"
import { sortAnswerOptionBySequenceNumber } from "@utils/sort"
import { getRandomColor } from "@utils/colors"

export const SkillMapResultsListTable = () => {
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const [showSkillMapModal, setShowSkillMapModal] = useState<boolean>(false)

  const { skill_map_results, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.skillMapResults
  )

  const { answer_options } = useAppSelector((state) => state.answerOptions)
  const { user_skill_map } = useAppSelector((state) => state.users)

  const [scaleYLabels, setScaleYLabels] = useState<string[]>([])
  const [data, setData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  })

  const SkillMapResultsDialog = lazy(
    async () => await import("@features/admin/skill-map-results/skill-map-results-dialog")
  )

  useEffect(() => {
    void appDispatch(getAnswerOptionsByType("Skill Map Scale"))
  }, [])

  useEffect(() => {
    void appDispatch(
      getSkillMapResultsLatest({
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
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
      processData(user_skill_map)
    }
  }, [user_skill_map])

  const toggleSkillMapModal = () => {
    const previousState = showSkillMapModal
    setShowSkillMapModal((prev) => !prev)
    if (previousState) {
      void appDispatch(setUserSkillMap([]))
    }
  }

  const handleViewSkillMapResult = (id: number) => {
    const skillMapResult = skill_map_results.find((result) => result.id === id)
    if (skillMapResult != null) {
      const userId = skillMapResult.users?.id
      if (userId !== undefined) {
        void appDispatch(getUserSkillMap(userId))
      }
    }
  }

  const renderCell = (item: SkillMapResult, column: unknown) => {
    switch (column) {
      case "Employee Name":
        return `${item.users?.last_name}, ${item.users?.first_name}`
      case "Latest Skill Map":
        return `${formatDate(item.submitted_date)}`
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
          data={skill_map_results}
          isRowClickable={true}
          renderCell={renderCell}
          onClickRow={handleViewSkillMapResult}
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
          title='Skill Map Details'
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
