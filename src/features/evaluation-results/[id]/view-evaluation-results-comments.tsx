import { useParams } from "react-router-dom"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Loading } from "../../../types/loadingType"

export const ViewEvaluationResultsComments = () => {
  const { id } = useParams()
  const { loading, evaluation_result } = useAppSelector((state) => state.evaluationResult)

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {(loading === Loading.Fulfilled && evaluation_result?.comments.length === 0) ||
        (evaluation_result?.comments.length === null && (
          <div className='flex italic text-s'>No comments.</div>
        ))}
      <div className='flex-1 flex-col'>
        <div className='text-xl font-bold mb-2 text-primary-500'>Comments: </div>
        {loading === Loading.Fulfilled &&
          evaluation_result?.comments !== undefined &&
          evaluation_result?.comments.length > 0 &&
          id !== undefined && (
            <div>
              <ul className='list-outside list-none ml-5'>
                {evaluation_result?.comments?.map((comment, commentIndex) => (
                  <div key={commentIndex} className='flex italic text-sm'>
                    - {comment?.length > 0 && <li className='m-1'>{comment}</li>}
                  </div>
                ))}
              </ul>
            </div>
          )}
        {evaluation_result?.comments.length === 0 && (
          <div className='flex italic text-s'>No comments.</div>
        )}
        <div className='text-xl font-bold mt-10 mb-2 text-primary-500'>Recommendations: </div>
        {loading === Loading.Fulfilled &&
          evaluation_result?.recommendations !== undefined &&
          evaluation_result?.recommendations.length > 0 &&
          id !== undefined && (
            <div>
              <ul className='list-outside list-none ml-5'>
                {evaluation_result?.recommendations?.map((recommendation, recommendationIndex) => (
                  <div key={recommendationIndex} className='flex italic text-sm'>
                    - {recommendation?.length > 0 && <li className='m-1'>{recommendation}</li>}
                  </div>
                ))}
              </ul>
            </div>
          )}
        {evaluation_result?.recommendations.length === 0 && (
          <div className='flex italic text-s'>No recommendations.</div>
        )}
      </div>
    </>
  )
}
