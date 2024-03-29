import { useEffect } from "react"
import { useAppSelector } from "@hooks/useAppSelector"
import { useParams } from "react-router-dom"
import { formatDateRange } from "@utils/format-date"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { PageTitle } from "@components/shared/page-title"
import { getCmEvaluationResult } from "@redux/slices/evaluation-result-slice"
import { ScoreRange } from "@components/shared/score-range/score-range"
import { useMobileView } from "@hooks/use-mobile-view"
import { getScoreRatings } from "@redux/slices/score-ratings-slice"

export const ViewEvaluationResultsHeader = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { evaluation_result } = useAppSelector((state) => state.evaluationResult)
  const isMobile = useMobileView()

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getCmEvaluationResult(parseInt(id)))
    }
    void appDispatch(getScoreRatings())
  }, [])

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col justify-between items-start md:items-end mt-2 md:flex-row gap-5'>
          <div>
            <div className='flex gap-4 primary-outline items-end mb-4'>
              <PageTitle>Evaluation Results</PageTitle>
            </div>
            <div className='flex gap-3 font-bold'>
              {evaluation_result?.users?.last_name}, {evaluation_result?.users?.first_name}
            </div>
            <div className='flex gap-3'>{evaluation_result?.eval_admin_name}</div>
            <div className='flex gap-3'>
              {formatDateRange(
                evaluation_result?.eval_period_start_date,
                evaluation_result?.eval_period_end_date
              )}
            </div>
          </div>
        </div>
        <div className='text-base md:text-xl text-primary-500 font-bold mt-10 mb-5'>
          Total Score: {evaluation_result?.total_score}%
        </div>
        <div className='w-9/10 md:w-800'>
          {evaluation_result?.score_rating !== undefined &&
            evaluation_result?.users?.picture !== undefined && (
              <ScoreRange
                user_picture={evaluation_result?.users?.picture}
                score_rating={evaluation_result?.score_rating}
                score={evaluation_result?.score}
                size={isMobile ? "extraSmall" : "medium"}
                is_evaluee={false}
              />
            )}
        </div>
      </div>
    </>
  )
}
