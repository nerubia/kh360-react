import { useContext, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { formatDate, shortenFormatDate } from "@utils/format-date"
import { Pagination } from "@components/shared/pagination/pagination"
import {
  getSkillMapAdministrations,
  getSkillMapAdministrationsSocket,
} from "@redux/slices/skill-map-administrations-slice"
import { setSkillMapResults } from "@redux/slices/skill-map-results-slice"
import { Badge } from "@components/ui/badge/badge"
import { getEvaluationAdministrationStatusVariant } from "@utils/variant"
import { useFullPath } from "@hooks/use-full-path"
import { setPreviousUrl } from "@redux/slices/app-slice"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"
import { Table } from "@components/ui/table/table"
import { skillMapColumns, type SkillMapAdministration } from "@custom-types/skill-map-admin-type"

export const SkillMapAdministrationsTable = () => {
  const fullPath = useFullPath()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { skill_map_administrations, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.skillMapAdministrations
  )
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  useEffect(() => {
    void appDispatch(
      getSkillMapAdministrationsSocket({
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [lastJsonMessage])

  useEffect(() => {
    void appDispatch(
      getSkillMapAdministrations({
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleViewSkillMapAdmin = (id: number) => {
    appDispatch(setSkillMapResults([]))
    appDispatch(setPreviousUrl(fullPath))
    navigate(`/admin/skill-map-administrations/${id}`)
  }

  const renderCell = (item: SkillMapAdministration, column: unknown) => {
    switch (column) {
      case "Name":
        return `${item.name}`
      case "Description":
        return `${item.remarks}`
      case "Schedule":
        return `${formatDate(item.skill_map_schedule_start_date)} to ${formatDate(
          item.skill_map_schedule_end_date
        )}`
      case "Status":
        return (
          <Badge variant={getEvaluationAdministrationStatusVariant(item?.status)} size='small'>
            <div className='uppercase'>{item?.status}</div>
          </Badge>
        )
    }
  }
  return (
    <div className='flex flex-col gap-8'>
      <div className='md:block hidden'>
        <Table
          columns={skillMapColumns}
          renderCell={renderCell}
          data={skill_map_administrations}
          isRowClickable={true}
          onClickRow={handleViewSkillMapAdmin}
        />
      </div>
      <div className='w-full md:hidden' data-testid='skill-map-admin-list'>
        <div className='flex gap-2 flex-col'>
          {skill_map_administrations.map((skillMapAdmin) => (
            <div
              className='cursor-pointer hover:bg-slate-100 rounded-md shadow-sm'
              key={skillMapAdmin.id}
              onClick={() => handleViewSkillMapAdmin(skillMapAdmin.id)}
            >
              <div className='py-1'>
                <span className='text-lg font-bold' data-testid='name'>
                  {skillMapAdmin.name}
                </span>
                <br />
                <span className='mr-1 text-sm font-light' data-testid='schedule'>
                  schedule:
                </span>
                {shortenFormatDate(formatDate(skillMapAdmin.skill_map_schedule_start_date))} to{" "}
                {shortenFormatDate(formatDate(skillMapAdmin.skill_map_schedule_end_date))}
                <br />
                <div className='py-1 flex'>
                  <span className='mr-1 text-sm font-light' data-testid='status'>
                    status:
                  </span>
                  <Badge
                    variant={getEvaluationAdministrationStatusVariant(skillMapAdmin?.status)}
                    size='small'
                  >
                    <div className='uppercase'>{skillMapAdmin?.status}</div>
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
  )
}
