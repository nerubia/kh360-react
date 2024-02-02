import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getCmEvaluationResults } from "@redux/slices/evaluation-results-slice"
import { Pagination } from "@components/shared/pagination/pagination"
import { formatDate } from "@utils/format-date"
import { useFullPath } from "@hooks/use-full-path"
import { setPreviousUrl } from "@redux/slices/app-slice"

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
    <div className='flex flex-col gap-8 overflow-x-auto'>
      <table className='min-w-600 w-full md:table-fixed whitespace-nowrap md:whitespace-normal'>
        <thead className='text-left'>
          <tr>
            <th className='pb-3 px-1 w-1/5'>Evaluee Name</th>
            <th className='pb-3 px-1 w-1/4'>Eval Admin Name</th>
            <th className='pb-3 px-1 w-1/4'>Eval Period</th>
            <th className='pb-3 px-1 w-1/5'>Score</th>
            <th className='pb-3 px-1 w-100'>Score Rating</th>
            <th className='pb-3 px-1 mid-w-100 md:w-90'>Z-Score</th>
            <th className='pb-3 px-1 md:w-90'>Banding</th>
          </tr>
        </thead>
        <tbody>
          {evaluation_results.map((evaluationResult) => (
            <tr
              className='cursor-pointer hover:bg-slate-100 w-9/10'
              key={evaluationResult.id}
              onClick={() => handleViewEvaluationResult(evaluationResult.id)}
            >
              <td className='py-1 px-2 min-w-100'>
                {evaluationResult.users?.last_name}, {evaluationResult.users?.first_name}
              </td>
              <td className='py-1 px-2 min-w-100'>
                {evaluationResult.evaluation_administration?.name}
              </td>
              <td className='py-1 px-2 min-w-100'>
                {formatDate(evaluationResult.evaluation_administration?.eval_period_start_date)} to{" "}
                {formatDate(evaluationResult.evaluation_administration?.eval_period_end_date)}
              </td>
              <td className='py-1 px-2 min-w-100'>{evaluationResult.score}</td>
              <td className='py-1 px-2 min-w-100'>
                {evaluationResult.score_ratings?.display_name}
              </td>
              <td className='py-1 px-2 min-w-100'>{evaluationResult.zscore}</td>
              <td className='py-1 px-2 min-w-100'>{evaluationResult.banding}</td>
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
