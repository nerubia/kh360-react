import { useEffect } from "react"
import { useAppSelector } from "@hooks/useAppSelector"
import { useParams, useNavigate } from "react-router-dom"
import { formatDateRange } from "@utils/format-date"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { PageTitle } from "@components/shared/page-title"
import { getUserEvaluationResult } from "@redux/slices/user-slice"
import { getScoreRatings } from "@redux/slices/score-ratings-slice"
import { ScoreRange } from "@components/shared/score-range/score-range"
import { useMobileView } from "@hooks/use-mobile-view"

export const MyEvaluationResultsHeader = () => {
  const isMobile = useMobileView()
  const navigate = useNavigate()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { user_evaluation_result } = useAppSelector((state) => state.user)
  const size = isMobile ? "small" : "medium"

  useEffect(() => {
    void handleGetUserEvaluationResult()
    void appDispatch(getScoreRatings())
  }, [])

  const handleGetUserEvaluationResult = async () => {
    if (id !== undefined) {
      const result = await appDispatch(getUserEvaluationResult(parseInt(id)))

      if (result.type === "user/getUserEvaluationResult/rejected") {
        navigate(`/my-evaluations`)
      }
    }
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col justify-between items-start md:items-end mt-2 md:flex-row gap-5'>
          <div>
            <div className='flex gap-4 primary-outline items-end mb-4'>
              <PageTitle>Evaluation Results</PageTitle>
            </div>
            <div className='flex gap-3 font-bold text-sm md:text-lg'>
              {user_evaluation_result?.users?.last_name},{" "}
              {user_evaluation_result?.users?.first_name}
            </div>
            <div className='flex gap-3 text-sm md:text-lg'>
              {user_evaluation_result?.eval_admin_name}
            </div>
            <div className='flex gap-3 text-sm md:text-lg'>
              {formatDateRange(
                user_evaluation_result?.eval_period_start_date,
                user_evaluation_result?.eval_period_end_date
              )}
            </div>
          </div>
        </div>
        <div className='text-sm md:text-xl text-primary-500 font-bold mt-10 mb-5'>
          Total Score: {user_evaluation_result?.total_score}%
        </div>
        <div className='w-500 lg:w-800'>
          {user_evaluation_result?.score_rating !== undefined &&
            user_evaluation_result?.users?.picture !== undefined && (
              <ScoreRange
                user_picture={user_evaluation_result?.users?.picture}
                score_rating={user_evaluation_result?.score_rating}
                score={user_evaluation_result?.score}
                is_evaluee={true}
                size={size}
              />
            )}
        </div>
      </div>
    </>
  )
}
