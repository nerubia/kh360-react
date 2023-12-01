import { useEffect } from "react"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { useParams } from "react-router-dom"
import { formatDateRange } from "../../../utils/format-date"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { PageTitle } from "../../../components/shared/PageTitle"
import { getUserEvaluationResult } from "../../../redux/slices/user-slice"

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
        <div className='flex flex-col justify-between items-start md:items-end mt-2 md:flex-row gap-4'>
          <div>
            <div className='flex gap-4 primary-outline items-end mb-4'>
              <PageTitle>Evaluation Results</PageTitle>
            </div>
            <p className='text-xl font-bold mb-2'>Employee Information</p>
            <div className='flex gap-3'>
              <div className='font-bold md:w-[150px]'>Name: </div>
              {user_evaluation_result?.users?.last_name},{" "}
              {user_evaluation_result?.users?.first_name}
            </div>
            <div className='flex gap-3'>
              <div className='font-bold md:w-[150px]'>Evaluation Period: </div>
              {formatDateRange(
                user_evaluation_result?.eval_period_start_date,
                user_evaluation_result?.eval_period_end_date
              )}
            </div>
            <div className='flex gap-3'>
              <div className='font-bold md:w-[150px]'>Status: </div>
              {user_evaluation_result?.status}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
