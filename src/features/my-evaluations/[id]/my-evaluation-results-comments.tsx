import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import { Skeleton } from "@components/ui/skeleton/Skeleton"

export const MyEvaluationResultsComments = () => {
  const { id } = useParams()
  const { loading, user_evaluation_result } = useAppSelector((state) => state.user)

  return (
    <>
      {loading === Loading.Pending && (
        <div className='flex flex-col gap-2'>
          <Skeleton className='w-36 h-6' />
          <div className='flex flex-col gap-2'>
            <Skeleton className='w-1/2 h-4' />
            <Skeleton className='w-1/2 h-4' />
            <Skeleton className='w-1/2 h-4' />
            <Skeleton className='w-1/2 h-4' />
          </div>
        </div>
      )}
      {(loading === Loading.Fulfilled && user_evaluation_result?.comments.length === 0) ||
        (user_evaluation_result?.comments.length === null && <div>No comments.</div>)}
      <div className='flex-1 flex-col'>
        {loading === Loading.Fulfilled &&
          user_evaluation_result?.comments !== undefined &&
          user_evaluation_result?.comments.length > 0 &&
          id !== undefined && (
            <div>
              <div className='text-sm md:text-xl font-bold mb-2 text-primary-500'>Comments </div>
              <ul className='list-outside list-none ml-5'>
                {user_evaluation_result?.comments?.map((comment, commentIndex) => (
                  <div key={commentIndex} className='flex italic text-xs md:text-sm'>
                    - {comment?.length > 0 && <li className='m-1'>{comment}</li>}
                  </div>
                ))}
              </ul>
            </div>
          )}
      </div>
    </>
  )
}
