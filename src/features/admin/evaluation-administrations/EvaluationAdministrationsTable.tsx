import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { formatDate } from "../../../utils/format-date"
import { Pagination } from "../../../components/pagination/Pagination"
import { getEvaluationAdministrations } from "../../../redux/slices/evaluation-administrations-slice"
import { setEvaluationResults } from "../../../redux/slices/evaluationResultsSlice"
import { Badge } from "../../../components/ui/badge/Badge"
import { getEvaluationAdministrationStatusVariant } from "../../../utils/variant"

export const EvaluationAdministrationsTable = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { evaluation_administrations, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.evaluationAdministrations
  )

  useEffect(() => {
    void appDispatch(
      getEvaluationAdministrations({
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleViewEvaluation = (id: number) => {
    appDispatch(setEvaluationResults([]))
    navigate(`/admin/evaluation-administrations/${id}`)
  }

  return (
    <div className='flex flex-col gap-8'>
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
              <td className='py-1'>{evaluationAdministration.name}</td>
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
