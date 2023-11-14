import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { formatDate } from "../../../utils/formatDate"
import { Pagination } from "../../../components/pagination/Pagination"
import { getEvaluationAdministrations } from "../../../redux/slices/evaluationAdministrationsSlice"
import { setEvaluationResults } from "../../../redux/slices/evaluationResultsSlice"

export const EvaluationAdministrationsTable = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const {
    evaluation_administrations,
    hasPreviousPage,
    hasNextPage,
    totalPages,
  } = useAppSelector((state) => state.evaluationAdministrations)

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
        <thead className='text-left border-b-2'>
          <tr>
            <th>Name</th>
            <th>Period</th>
            <th>Schedule</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {evaluation_administrations.map((evaluationAdministration) => (
            <tr
              className='cursor-pointer hover:bg-slate-100'
              key={evaluationAdministration.id}
              onClick={() => handleViewEvaluation(evaluationAdministration.id)}
            >
              <td>{evaluationAdministration.name}</td>
              <td>
                {formatDate(evaluationAdministration.eval_period_start_date)} to{" "}
                {formatDate(evaluationAdministration.eval_period_end_date)}
              </td>
              <td>
                {formatDate(evaluationAdministration.eval_schedule_start_date)}{" "}
                to {formatDate(evaluationAdministration.eval_schedule_end_date)}
              </td>
              <td>{evaluationAdministration.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-center'>
        <Pagination
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}
