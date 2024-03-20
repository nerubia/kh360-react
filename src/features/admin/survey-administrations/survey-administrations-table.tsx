import { useContext, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { formatDate, shortenFormatDate } from "@utils/format-date"
import { Pagination } from "@components/shared/pagination/pagination"
import {
  getSurveyAdministrations,
  getSurveyAdministrationsSocket,
} from "@redux/slices/survey-administrations-slice"
import { setSurveyResults } from "@redux/slices/survey-results-slice"
import { Badge } from "@components/ui/badge/badge"
import { getEvaluationAdministrationStatusVariant } from "@utils/variant"
import { useFullPath } from "@hooks/use-full-path"
import { setPreviousUrl } from "@redux/slices/app-slice"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"
import { Table } from "@components/ui/table/table"
import {
  surveyAdminColumns,
  type SurveyAdminstration,
} from "@custom-types/survey-administration-type"

export const SurveyAdministrationsTable = () => {
  const fullPath = useFullPath()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { survey_administrations, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.surveyAdministrations
  )
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  useEffect(() => {
    void appDispatch(
      getSurveyAdministrationsSocket({
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [lastJsonMessage])

  useEffect(() => {
    void appDispatch(
      getSurveyAdministrations({
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleViewSurvey = (id: number) => {
    appDispatch(setSurveyResults([]))
    appDispatch(setPreviousUrl(fullPath))
    navigate(`/admin/survey-administrations/${id}`)
  }

  const renderCell = (item: SurveyAdminstration, column: unknown) => {
    switch (column) {
      case "Name":
        return `${item.name}`
      case "Description":
        return `${item.remarks}`
      case "Schedule":
        return `${formatDate(item.survey_start_date)} to ${formatDate(item.survey_end_date)}`
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
          columns={surveyAdminColumns}
          renderCell={renderCell}
          data={survey_administrations}
          isRowClickable={true}
          onClickRow={handleViewSurvey}
        />
      </div>
      <div className='w-full md:hidden' data-testid='survey-list'>
        <div className='flex gap-2 flex-col'>
          {survey_administrations.map((surveyAdministration) => (
            <div
              className='cursor-pointer hover:bg-slate-100 rounded-md shadow-sm'
              key={surveyAdministration.id}
              onClick={() => handleViewSurvey(surveyAdministration.id)}
            >
              <div className='py-1'>
                <span className='text-lg font-bold' data-testid='name'>
                  {surveyAdministration.name}
                </span>
                <br />
                <span className='mr-1 text-sm font-light' data-testid='schedule'>
                  schedule:
                </span>
                {shortenFormatDate(formatDate(surveyAdministration.survey_start_date))} to{" "}
                {shortenFormatDate(formatDate(surveyAdministration.survey_end_date))}
                <br />
                <div className='py-1 flex'>
                  <span className='mr-1 text-sm font-light' data-testid='status'>
                    status:
                  </span>
                  <Badge
                    variant={getEvaluationAdministrationStatusVariant(surveyAdministration?.status)}
                    size='small'
                  >
                    <div className='uppercase'>{surveyAdministration?.status}</div>
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
