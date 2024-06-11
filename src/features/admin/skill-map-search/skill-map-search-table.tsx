import { useEffect, useState, Suspense, type ReactNode } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Pagination } from "@components/shared/pagination/pagination"
import { columns, type SkillMapSearch } from "@custom-types/skill-map-search-type"
import { getSkillMapSearch } from "@redux/slices/skill-map-search-slice"
import { Table } from "@components/ui/table/table"
import SkillMapResultsDialog from "../skill-map-results/skill-map-results-dialog"
import { LineGraph } from "@components/ui/linegraph/linegraph"

export const SkillMapSearchTable = () => {
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const [showSkillMapModal, setShowSkillMapModal] = useState<boolean>(false)
  const [selectedSkillMapResult, setSelectedSkillMapResult] = useState<SkillMapSearch | null>(null)

  const { skill_map_search, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.skillMapSearch
  )

  useEffect(() => {
    void appDispatch(
      getSkillMapSearch({
        name: searchParams.get("name") ?? undefined,
        skill: searchParams.get("skill") ?? undefined,
      })
    )
  }, [])

  useEffect(() => {
    void appDispatch(
      getSkillMapSearch({
        name: searchParams.get("name") ?? undefined,
        skill: searchParams.get("skill") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const toggleSkillMapModal = () => {
    setShowSkillMapModal((prev) => !prev)
  }

  const handleRowClick = (item: SkillMapSearch) => {
    setSelectedSkillMapResult(item)
    setShowSkillMapModal(true)
  }

  const renderCell = (item: SkillMapSearch, column: ReactNode): ReactNode => {
    const columnName = column as string
    switch (columnName) {
      case "Name":
        return (
          <div onClick={() => handleRowClick(item)}>
            {item.users?.last_name},{item.users?.first_name}
          </div>
        )
      case "Skill":
        return item.skill_map_ratings?.map((rating) => rating.skills.name).join(", ")
      default:
        return ""
    }
  }

  return (
    <>
      <div className='flex flex-col gap-8 overflow-x-auto'>
        <Table
          columns={columns}
          data={skill_map_search}
          isRowClickable={true}
          renderCell={renderCell}
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
            selectedSkillMapResult?.users?.id !== undefined ? (
              <LineGraph id={selectedSkillMapResult.users.id} />
            ) : null
          }
          onSubmit={toggleSkillMapModal}
        />
      </Suspense>
    </>
  )
}
