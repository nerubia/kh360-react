import { useContext, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { formatDate, shortenFormatDate } from "../../../utils/format-date"
import { Pagination } from "../../../components/shared/pagination/pagination"
import { getEvaluationAdministrations } from "../../../redux/slices/evaluation-administrations-slice"
import { setEvaluationResults } from "../../../redux/slices/evaluation-results-slice"
import { Badge } from "../../../components/ui/badge/badge"
import { getEvaluationAdministrationStatusVariant } from "../../../utils/variant"
import { useFullPath } from "../../../hooks/use-full-path"
import { setPreviousUrl } from "../../../redux/slices/app-slice"
import { WebSocketContext, type WebSocketType } from "../../../components/providers/websocket"

export const EvaluationAdministrationsTable = () => {
  const fullPath = useFullPath()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { evaluation_administrations, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.evaluationAdministrations
  )
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  useEffect(() => {
    void appDispatch(
      getEvaluationAdministrations({
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [lastJsonMessage, searchParams])

  const handleViewEvaluation = (id: number) => {
    appDispatch(setEvaluationResults([]))
    appDispatch(setPreviousUrl(fullPath))
    navigate(`/admin/evaluation-administrations/${id}`)
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='md:block hidden'>
        <table className='w-full table-fixed'>
          <thead className='text-left'>
            <tr>
              <th className='pb-3'>Name</th>
              <th className='pb-3'>Period</th>
              <th className='pb-3'>Schedule</th>
              <th className='pb-3'>Status</th>
            </tr>
          </thead>
          <tbody>
            {evaluation_administrations.map((evaluationAdministration) => (
              <tr
                className='cursor-pointer hover:bg-slate-100'
                key={evaluationAdministration.id}
                onClick={() => handleViewEvaluation(evaluationAdministration.id)}
              >
                <td className='py-1 '>{evaluationAdministration.name}</td>
                <td className='py-1'>
                  {formatDate(evaluationAdministration.eval_period_start_date)} to{" "}
                  {formatDate(evaluationAdministration.eval_period_end_date)}
                </td>
                <td className='py-1'>
                  {formatDate(evaluationAdministration.eval_schedule_start_date)} to{" "}
                  {formatDate(evaluationAdministration.eval_schedule_end_date)}
                </td>
                <td className='py-1'>
                  <Badge
                    variant={getEvaluationAdministrationStatusVariant(
                      evaluationAdministration?.status
                    )}
                    size='small'
                  >
                    <div className='uppercase'>{evaluationAdministration?.status}</div>
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='w-full md:hidden' data-testid='eval-list'>
        <div className='flex gap-2 flex-col'>
          {evaluation_administrations.map((evaluationAdministration) => (
            <div
              className='cursor-pointer hover:bg-slate-100 rounded-md shadow-sm'
              key={evaluationAdministration.id}
              onClick={() => handleViewEvaluation(evaluationAdministration.id)}
            >
              <div className='py-1'>
                <span className='text-lg font-bold' data-testid='name'>
                  {evaluationAdministration.name}
                </span>
                <br />
                <span className='mr-1 text-sm font-light' data-testid='period'>
                  period:
                </span>
                {shortenFormatDate(formatDate(evaluationAdministration.eval_period_start_date))} to{" "}
                {shortenFormatDate(formatDate(evaluationAdministration.eval_period_end_date))}
                <br />
                <span className='mr-1 text-sm font-light' data-testid='schedule'>
                  schedule:
                </span>
                {shortenFormatDate(formatDate(evaluationAdministration.eval_schedule_start_date))}{" "}
                to {shortenFormatDate(formatDate(evaluationAdministration.eval_schedule_end_date))}
                <div className='py-1 flex'>
                  <span className='mr-1 text-sm font-light' data-testid='status'>
                    status:
                  </span>
                  <Badge
                    variant={getEvaluationAdministrationStatusVariant(
                      evaluationAdministration?.status
                    )}
                    size='small'
                  >
                    <div className='uppercase'>{evaluationAdministration?.status}</div>
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
