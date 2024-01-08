import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { getCmEvaluationResults } from "../../redux/slices/evaluation-results-slice"
import { Pagination } from "../../components/shared/pagination/pagination"
import { formatDate } from "../../utils/format-date"
import { useFullPath } from "../../hooks/use-full-path"
import { setPreviousUrl } from "../../redux/slices/app-slice"

export const EvaluationResultsListTable = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fullPath = useFullPath()

  const appDispatch = useAppDispatch()

  const { evaluation_results, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.evaluationResults
  )

  useEffect(() => {
    void appDispatch(
      getCmEvaluationResults({
        name: searchParams.get("name") ?? undefined,
        evaluation_administration_id: searchParams.get("evaluation_administration_id") ?? undefined,
        score_ratings_id: searchParams.get("score_ratings_id") ?? undefined,
        banding: searchParams.get("banding") ?? undefined,
        sort_by: searchParams.get("sort_by") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleViewEvaluationResult = (id: number) => {
    appDispatch(setPreviousUrl(fullPath))
    navigate(`/evaluation-results/${id}`)
  }

  return (
    <div className='flex flex-col gap-8'>
      <table className='w-full table-fixed'>
        <thead className='text-left'>
          <tr>
            <th className='pb-3 w-1/5'>Evaluee Name</th>
            <th className='pb-3 w-1/4'>Eval Admin Name</th>
            <th className='pb-3 w-1/4'>Eval Period</th>
            <th className='pb-3'>Score</th>
            <th className='pb-3 w-[12%]'>Score Rating</th>
            <th className='pb-3'>Z-Score</th>
            <th className='pb-3'>Banding</th>
          </tr>
        </thead>
        <tbody>
          {evaluation_results.map((evaluationResult) => (
            <tr
              className='cursor-pointer hover:bg-slate-100'
              key={evaluationResult.id}
              onClick={() => handleViewEvaluationResult(evaluationResult.id)}
            >
              <td className='py-1'>
                {evaluationResult.users?.last_name}, {evaluationResult.users?.first_name}
              </td>
              <td className='py-1'>{evaluationResult.evaluation_administration?.name}</td>
              <td className='py-1'>
                {formatDate(evaluationResult.evaluation_administration?.eval_period_start_date)} to{" "}
                {formatDate(evaluationResult.evaluation_administration?.eval_period_end_date)}
              </td>
              <td className='py-1'>{evaluationResult.score}</td>
              <td className='py-1'>{evaluationResult.score_ratings?.display_name}</td>
              <td className='py-1'>{evaluationResult.zscore}</td>
              <td className='py-1'>{evaluationResult.banding}</td>
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
