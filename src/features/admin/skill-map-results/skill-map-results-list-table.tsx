import { useEffect, useState, lazy, Suspense } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getCmEvaluationResults } from "@redux/slices/evaluation-results-slice"
import { Pagination } from "@components/shared/pagination/pagination"
import { Table } from "@components/ui/table/table"
import { formatDate } from "@utils/format-date"
import { columns } from "@custom-types/skill-map-result-type"
import { getUserLatestSkillMapRatings } from "@redux/slices/user-slice"
import { type SkillMapResultLatest } from "@custom-types/skill-map-result-latest"
import { LineGraph } from "@components/ui/linegraph/linegraph"

export const SkillMapResultsListTable = () => {
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const [showSkillMapModal, setShowSkillMapModal] = useState<boolean>(false)
  const [selectedSkillMapResult, setSelectedSkillMapResult] = useState<SkillMapResultLatest | null>(
    null
  )

  const { hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.skillMapResults
  )
  const { user_latest_skill_map_result, user_latest_skill_map_result_filtered } = useAppSelector(
    (state) => state.user
  )
  const SkillMapResultsDialog = lazy(
    async () => await import("@features/admin/skill-map-results/skill-map-results-dialog")
  )

  useEffect(() => {
    void appDispatch(
      getCmEvaluationResults({
        name: searchParams.get("name") ?? undefined,
        evaluation_administration_id: searchParams.get("evaluation_administration_id") ?? undefined,
        score_ratings_id: searchParams.get("score_ratings_id") ?? undefined,
        banding: searchParams.get("banding") ?? undefined,
        sort_by: searchParams.get("sort_by") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  useEffect(() => {
    void appDispatch(getUserLatestSkillMapRatings())
  }, [])

  const toggleSkillMapModal = () => {
    setShowSkillMapModal((prev) => !prev)
  }

  const handleViewSkillMapResult = (id: number) => {
    const skillMapResult = user_latest_skill_map_result.find((result) => result.id === id)
    if (skillMapResult != null) {
      setSelectedSkillMapResult(skillMapResult)
      toggleSkillMapModal()
    }
  }

  const renderCell = (item: SkillMapResultLatest, column: unknown) => {
    switch (column) {
      case "Employee Name":
        return `${item.users?.last_name}, ${item.users?.first_name}`
      case "Latest Skill Map":
        return `${formatDate(item.submitted_date)}`
    }
  }

  return (
    <>
      <div className='flex flex-col gap-8 overflow-x-auto'>
        <Table
          columns={columns}
          data={
            user_latest_skill_map_result_filtered.length === 0 && searchParams.size === 0
              ? user_latest_skill_map_result
              : user_latest_skill_map_result_filtered
          }
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
            selectedSkillMapResult != null ? (
              <>
                <LineGraph id={selectedSkillMapResult.users.id} />
              </>
            ) : null
          }
          onSubmit={toggleSkillMapModal}
        />
      </Suspense>
    </>
  )
}
