import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"

export const ViewEvaluationResultsComments = () => {
  const { id } = useParams()
  const { loading, evaluation_result } = useAppSelector((state) => state.evaluationResult)

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      <div className='flex-1 flex-col'>
        <div className='flex flex-col gap-5'>
          <div>
            <div className='text-sm md:text-xl font-bold mb-2 text-primary-500'>Comments</div>
            {loading === Loading.Fulfilled &&
              evaluation_result?.comments !== undefined &&
              evaluation_result?.comments.length > 0 &&
              id !== undefined && (
                <ul className='list-outside list-none ml-5'>
                  {evaluation_result?.comments?.map((comment, commentIndex) => (
                    <div key={commentIndex} className='flex italic text-xs md:text-sm'>
                      - {comment?.length > 0 && <li className='m-1'>{comment}</li>}
                    </div>
                  ))}
                </ul>
              )}
            {evaluation_result?.comments.length === 0 && (
              <div className='flex italic text-s ml-4'>No comments.</div>
            )}
          </div>
          {loading === Loading.Fulfilled &&
            evaluation_result?.other_comments !== undefined &&
            evaluation_result?.other_comments.length > 0 && (
              <div>
                <div className='text-sm md:text-xl font-bold mb-2 text-primary-500'>
                  Did not Evaluate:
                </div>
                <ul className='list-outside list-none ml-5'>
                  {evaluation_result?.other_comments?.map((comment, commentIndex) => (
                    <div key={commentIndex} className='flex text-xs md:text-sm'>
                      -{" "}
                      {comment?.comment.length > 0 && (
                        <li className='m-1'>
                          <span>
                            {comment.evaluator.last_name}, {comment.evaluator.first_name}:
                          </span>{" "}
                          <span className='italic'>{comment.comment}</span>
                        </li>
                      )}
                    </div>
                  ))}
                </ul>
              </div>
            )}
        </div>
        <div className='text-base md:text-xl font-bold mt-10 mb-2 text-primary-500'>
          Recommendations:{" "}
        </div>
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
          <div className='flex italic text-sm md:text-base ml-4'>No recommendations.</div>
        )}
      </div>
    </>
  )
}
