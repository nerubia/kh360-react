import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { formatDate, shortenFormatDate } from "@utils/format-date"
import { Pagination } from "@components/shared/pagination/pagination"
import { setSurveyResults } from "@redux/slices/survey-results-slice"
import { Badge } from "@components/ui/badge/badge"
import { getEvaluationAdministrationStatusVariant } from "@utils/variant"
import { useFullPath } from "@hooks/use-full-path"
import { setPreviousUrl } from "@redux/slices/app-slice"
import { Table } from "@components/ui/table/table"
import { type SurveyAdminstration } from "@custom-types/survey-administration-type"
import { columns } from "@custom-types/survey-result-type"

export const SurveyResultsTable = () => {
  const fullPath = useFullPath()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { all_survey_administrations } = useAppSelector((state) => state.surveyAdministrations)

  const handleViewSurvey = (id: number) => {
    appDispatch(setSurveyResults([]))
    appDispatch(setPreviousUrl(fullPath))
    navigate(`/admin/survey-result/${id}`)
  }

  const renderCell = (item: SurveyAdminstration, column: unknown) => {
    switch (column) {
      case "Name":
        return `${item.name}`
      case "Description":
        return `${item.remarks}`
      case "Schedule":
        return `${formatDate(item.survey_start_date)} to ${formatDate(item.survey_end_date)}`
      default:
        return null
    }
  }

  // Filter and paginate closed survey administrations
  const closedSurveyAdministrations = all_survey_administrations.filter(
    (surveyAdministration) => surveyAdministration.status === "Closed"
  )
  const itemsPerPage = 10
  const totalPages = Math.ceil(closedSurveyAdministrations.length / itemsPerPage)
  const currentPage = Number(searchParams.get("page") ?? 1)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = closedSurveyAdministrations.slice(startIndex, endIndex)

  return (
    <div className='flex flex-col gap-8'>
      <div className='md:block hidden'>
        <Table
          columns={columns}
          renderCell={renderCell}
          data={paginatedData}
          isRowClickable={true}
          onClickRow={handleViewSurvey}
        />
      </div>
      <div className='w-full md:hidden' data-testid='survey-list'>
        <div className='flex gap-2 flex-col'>
          {paginatedData.map((surveyAdministration) => (
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
            hasPreviousPage={currentPage > 1}
            hasNextPage={currentPage < totalPages}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  )
}
