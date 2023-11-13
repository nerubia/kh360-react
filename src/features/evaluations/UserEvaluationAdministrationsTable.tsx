import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { formatDate } from "../../utils/formatDate"
import { Pagination } from "../../components/pagination/Pagination"
import { getUserEvaluationAdministrations } from "../../redux/slices/userSlice"

export const UserEvaluationAdministrationsTable = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const {
    user_evaluation_administrations,
    hasPreviousPage,
    hasNextPage,
    totalPages,
  } = useAppSelector((state) => state.user)

  useEffect(() => {
    void appDispatch(
      getUserEvaluationAdministrations({
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleViewEvaluation = (id: number) => {
    navigate(`/evaluation-administrations/${id}/evaluations/all`)
  }

  return (
    <div className='flex flex-col gap-8'>
      <table className='w-full table-fixed'>
        <thead className='text-left border-b-2'>
          <tr>
            <th className='pb-2'>Name</th>
            <th className='pb-2'>Period</th>
            <th className='pb-2'>Schedule</th>
            <th className='pb-2'>Total Evaluations</th>
            <th className='pb-2'>Total Submitted</th>
            <th className='pb-2'>Total Pending</th>
          </tr>
        </thead>
        <tbody>
          {user_evaluation_administrations.map((evaluationAdministration) => (
            <tr
              className='cursor-pointer hover:bg-slate-100'
              key={evaluationAdministration.id}
              onClick={() => handleViewEvaluation(evaluationAdministration.id)}
            >
              <td className='py-2'>{evaluationAdministration.name}</td>
              <td className='py-2'>
                {formatDate(evaluationAdministration.eval_period_start_date)} to{" "}
                {formatDate(evaluationAdministration.eval_period_end_date)}
              </td>
              <td className='py-2'>
                {formatDate(evaluationAdministration.eval_schedule_start_date)}{" "}
                to {formatDate(evaluationAdministration.eval_schedule_end_date)}
              </td>
              <td className='py-2'>
                {evaluationAdministration.totalEvaluations}
              </td>
              <td className='py-2'>
                {evaluationAdministration.totalSubmitted}
              </td>
              <td className='py-2'>{evaluationAdministration.totalPending}</td>
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
