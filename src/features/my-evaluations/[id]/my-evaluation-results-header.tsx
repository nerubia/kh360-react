import { useEffect } from "react"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { useParams } from "react-router-dom"
import { formatDateRange } from "../../../utils/format-date"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { PageTitle } from "../../../components/shared/page-title"
import { getUserEvaluationResult } from "../../../redux/slices/user-slice"
import { ScoreRange } from "../../../components/shared/score-range/score-range"

export const MyEvaluationResultsHeader = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { user_evaluation_result } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getUserEvaluationResult(parseInt(id)))
    }
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
              {user_evaluation_result?.users?.last_name},{" "}
              {user_evaluation_result?.users?.first_name}
            </div>
            <div className='flex gap-3'>{user_evaluation_result?.eval_admin_name}</div>
            <div className='flex gap-3'>
              {formatDateRange(
                user_evaluation_result?.eval_period_start_date,
                user_evaluation_result?.eval_period_end_date
              )}
            </div>
          </div>
        </div>
        <div className='text-xl text-primary-500 font-bold my-5'>
          Total Score: {user_evaluation_result?.total_score}%
        </div>
        {user_evaluation_result?.score_rating !== undefined &&
          user_evaluation_result?.users?.picture !== undefined && (
            <ScoreRange
              user_picture={user_evaluation_result?.users?.picture}
              score_rating={user_evaluation_result?.score_rating}
              score={user_evaluation_result?.score}
              size='medium'
            />
          )}
      </div>
    </>
  )
}
