import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { formatDate } from "../../../utils/formatDate"
import { Pagination } from "../../../components/pagination/Pagination"
import { getEvaluationAdministrations } from "../../../redux/slices/evaluationAdministrationsSlice"

export const EvaluationAdministrationsTable = () => {
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

  return (
    <div className='flex flex-col gap-8'>
      <table className='w-full table-fixed'>
        <thead className='text-left'>
          <tr>
            <th>Name</th>
            <th>Period</th>
            <th>Schedule</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {evaluation_administrations.map((evaluationAdministration) => (
            <tr key={evaluationAdministration.id}>
              <td>{evaluationAdministration.name}</td>
              <td>
                {formatDate(evaluationAdministration.eval_period_start_date)} -{" "}
                {formatDate(evaluationAdministration.eval_period_end_date)}
              </td>
              <td>
                {formatDate(evaluationAdministration.eval_schedule_start_date)}{" "}
                - {formatDate(evaluationAdministration.eval_schedule_end_date)}
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
