import { useEffect, useState, lazy, Suspense } from "react"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Pagination } from "@components/shared/pagination/pagination"
import { Table } from "@components/ui/table/table"
import { convertToFullDate, convertToMonthAndYear } from "@utils/format-date"
import { type SkillMapResult, columns } from "@custom-types/skill-map-result-type"
import {
  getUserSkillMap,
  setSelectedSkillMapAdminId,
  setUserSkillMap,
} from "@redux/slices/users-slice"
import { getAnswerOptionsByType } from "@redux/slices/answer-options-slice"
import { SkillMapResultsGraph } from "./skill-map-results-graph"
import { useSearchParams } from "react-router-dom"
import { getSkillMapResultsLatest } from "@redux/slices/skill-map-results-slice"

export const SkillMapResultsListTable = () => {
  const [searchParams] = useSearchParams()
  const appDispatch = useAppDispatch()
  const [showSkillMapModal, setShowSkillMapModal] = useState<boolean>(false)

  const { skill_map_results, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.skillMapResults
  )

  const SkillMapResultsDialog = lazy(
    async () => await import("@features/admin/skill-map-results/skill-map-results-dialog")
  )

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
    void appDispatch(getAnswerOptionsByType("Skill Map Scale"))
  }, [])

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
        void appDispatch(setSelectedSkillMapAdminId("all"))
        toggleSkillMapModal()
      }
    }
  }

  const renderCell = (item: SkillMapResult, column: unknown) => {
    switch (column) {
      case "Employee Name":
        return `${item.users?.last_name}, ${item.users?.first_name}`
      case "Latest Period Date":
        return (
          <div>
            <p className='text-sm'>
              {convertToMonthAndYear(
                item.skill_map_administrations?.skill_map_period_end_date ?? ""
              )}
            </p>
          </div>
        )
      case "Latest Submitted Date":
        return (
          <div>
            <p className='text-sm'>{convertToFullDate(item.submitted_date ?? "")}</p>
          </div>
        )
    }
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
          description={<SkillMapResultsGraph />}
          onSubmit={toggleSkillMapModal}
        />
      </Suspense>
    </>
  )
}
