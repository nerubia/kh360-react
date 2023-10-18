import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { getEvaluations } from "../../../redux/slices/evaluationsSlice"
import { formatDate } from "../../../utils/formatDate"
import { Pagination } from "../../../components/pagination/Pagination"

export const EvaluationsTable = () => {
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { evaluations, hasPreviousPage, hasNextPage, totalPages } =
    useAppSelector((state) => state.evaluations)

  useEffect(() => {
    void appDispatch(
      getEvaluations({
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
          {evaluations.map((evaluation) => (
            <tr key={evaluation.id}>
              <td>{evaluation.name}</td>
              <td>
                {formatDate(evaluation.eval_period_start_date)} -{" "}
                {formatDate(evaluation.eval_period_end_date)}
              </td>
              <td>
                {formatDate(evaluation.eval_schedule_start_date)} -{" "}
                {formatDate(evaluation.eval_schedule_end_date)}
              </td>
              <td>{evaluation.status}</td>
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
