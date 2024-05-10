import { useEffect, useState, lazy, Suspense } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getCmEvaluationResults } from "@redux/slices/evaluation-results-slice"
import { Pagination } from "@components/shared/pagination/pagination"
import { Table } from "@components/ui/table/table"
import { formatDate } from "@utils/format-date"
import { type SkillMapResult, columns } from "@custom-types/skill-map-result-type"

export const SkillMapResultsListTable = () => {
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const [showSkillMapModal, setShowSkillMapModal] = useState<boolean>(false)

  const { hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.skillMapResults
  )

  const SkillMapResultsDialog = lazy(
    async () => await import("@features/admin/skill-map-results/skill-map-results-dialog")
  )

  // Hard coded dummy data for skill_map_results
  // Please delete this after API integration

  const skill_map_results = [
    {
      id: 1,
      users: {
        id: 1,
        first_name: "Sample",
        last_name: "User",
      },
      last_skill_map_date: "2024-01-01",
    },
  ]

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

  const toggleSkillMapModal = () => {
    setShowSkillMapModal((prev) => !prev)
  }

  const handleViewSkillMapResult = (id: number) => {
    toggleSkillMapModal()
    /* eslint-disable */
    // Call api to get skill map result details here
    console.log("ID: ", id)
  }

  const renderCell = (item: SkillMapResult, column: unknown) => {
    switch (column) {
      case "Employee Name":
        return `${item.users?.last_name} ${item.users?.first_name}`
      case "Latest Skill Map":
        return `${formatDate(item.last_skill_map_date)}`
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
          title='Skill Map Result Details'
          description={<></>}
          onSubmit={toggleSkillMapModal}
        />
      </Suspense>
    </>
  )
}
