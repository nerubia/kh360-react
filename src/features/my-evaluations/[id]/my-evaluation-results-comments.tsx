import { useParams } from "react-router-dom"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Loading } from "../../../types/loadingType"

export const MyEvaluationResultsComments = () => {
  const { id } = useParams()
  const { loading, user_evaluation_result } = useAppSelector((state) => state.user)

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {(loading === Loading.Fulfilled && user_evaluation_result?.comments.length === 0) ||
        (user_evaluation_result?.comments.length === null && <div>No comments.</div>)}
      <div className='flex-1 flex-col my-5'>
        {loading === Loading.Fulfilled &&
          user_evaluation_result?.comments !== undefined &&
          user_evaluation_result?.comments.length > 0 &&
          id !== undefined && (
            <div>
              <div className='text-xl font-bold mb-2'>Comments from Evaluators </div>
              <ul className='list-outside list-disc ml-5'>
                {user_evaluation_result?.comments?.map((comment, commentIndex) => (
                  <div key={commentIndex}>
                    {comment?.length > 0 && <li className='m-1'>{comment}</li>}
                  </div>
                ))}
              </ul>
            </div>
          )}
      </div>
    </>
  )
}
