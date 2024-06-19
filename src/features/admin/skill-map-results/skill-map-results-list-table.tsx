import { useEffect, useState, lazy, Suspense } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Pagination } from "@components/shared/pagination/pagination"
import { Table } from "@components/ui/table/table"
import { formatDate } from "@utils/format-date"
import { type SkillMapResult, columns } from "@custom-types/skill-map-result-type"
import { LineGraph } from "@components/ui/linegraph/linegraph"
import { getSkillMapResultsLatest } from "@redux/slices/skill-map-results-slice"

export const SkillMapResultsListTable = () => {
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const [showSkillMapModal, setShowSkillMapModal] = useState<boolean>(false)
  const [selectedSkillMapResult, setSelectedSkillMapResult] = useState<SkillMapResult | null>(null)

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

  const toggleSkillMapModal = () => {
    setShowSkillMapModal((prev) => !prev)
  }

  const handleViewSkillMapResult = (id: number) => {
    const skillMapResult = skill_map_results.find((result) => result.id === id)
    if (skillMapResult != null) {
      setSelectedSkillMapResult(skillMapResult)
      toggleSkillMapModal()
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
            selectedSkillMapResult != null ? (
              <div>
                <LineGraph id={selectedSkillMapResult.user_id} />
              </div>
            ) : null
          }
          onSubmit={toggleSkillMapModal}
        />
      </Suspense>
    </>
  )
}
