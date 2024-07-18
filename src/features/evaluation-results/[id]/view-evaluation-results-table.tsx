import React, { useState, lazy, Suspense } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import { type EvaluationResultDetail } from "@custom-types/evaluation-result-detail-type"
import { Progress } from "@components/ui/progress/progress"
import { getScoreVariant } from "@utils/variant"

export const ViewEvaluationResultsTable = () => {
  const { id } = useParams()
  const { loading, evaluation_result } = useAppSelector((state) => state.evaluationResult)
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [selectedEvaluationResultDetail, setSelectedEvaluationResultDetail] =
    useState<EvaluationResultDetail>()

  const EvaluationResultDetailsDialog = lazy(
    async () => await import("@features/evaluation-results/evaluation-results-dialog")
  )

  const toggleDetails = () => {
    setShowDetails((prev) => !prev)
  }

  const handleOpenDetails = (detail: EvaluationResultDetail) => {
    setSelectedEvaluationResultDetail(detail)
  }

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && evaluation_result === null && <div>Not found</div>}
      <div>
        {loading === Loading.Fulfilled &&
          evaluation_result?.evaluation_result_details !== undefined &&
          evaluation_result?.evaluation_result_details.length > 0 &&
          id !== undefined && (
            <>
              <div className='text-base md:text-xl text-primary-500 font-bold mb-5'>
                Detailed Evaluation{" "}
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full md:w-900 whitespace-nowrap'>
                  <thead className='text-left'>
                    <tr>
                      <th className='p-2 border-b-4 text-primary-500 md:w-1/4'>Evaluations</th>
                      <th className='p-2 border-b-4 text-center text-primary-500 md:w-1/6'>
                        Score
                      </th>
                      <th className='p-2 border-b-4 text-start text-primary-500 md:w-1/4'>
                        Rating
                      </th>
                      <th className='p-2 border-b-4 text-start text-primary-500 md:w-1/6'>
                        Standard Score
                      </th>
                      <th className='p-2 border-b-4 text-start text-primary-500 w-1/4'>Banding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluation_result?.evaluation_result_details.map((detail) => (
                      <React.Fragment key={detail.id}>
                        {Number(detail.weight) !== 0 && (
                          <tr
                            className='cursor-pointer hover:bg-slate-100'
                            onClick={() => {
                              handleOpenDetails(detail)
                              toggleDetails()
                            }}
                          >
                            <td className='p-2 px-2 border-b w-1/4'>{detail.template_name}</td>
                            <td className='p-2 px-2 border-b text-center w-1/6'>
                              {detail.total_score}%
                            </td>
                            {detail.score_rating?.display_name !== null && (
                              <td className='p-2 px-2 border-b text-start items-center w-1/5'>
                                {detail.score_rating?.display_name}
                              </td>
                            )}
                            <td className='p-2 px-2 border-b text-start items-center w-1/6'>
                              {Number(detail.zscore).toFixed(2)}
                            </td>
                            <td className='p-2 px-2 border-b text-start items-center w-1/4'>
                              {detail.banding}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
      </div>
      <Suspense>
        <EvaluationResultDetailsDialog
          open={showDetails}
          onSubmit={toggleDetails}
          title={
            <div className='p-2 text-primary-500'>
              {selectedEvaluationResultDetail?.template_name} Score:{" "}
              {selectedEvaluationResultDetail?.total_score}%
            </div>
          }
          description={
            <div className='overflow-auto'>
              {selectedEvaluationResultDetail?.evaluation_template_contents?.map(
                (content, index) => (
                  <div key={index} className='hover:bg-slate-100 p-2'>
                    <div className='flex justify-between mb-2 flex-col md:flex-row overflow-x-hidden'>
                      <div className='text-primary-500 font-bold w-2/3'>{content.name}</div>
                      <div className='w-600 relative'>
                        <div className='relative z-0 w-9/20 md:w-full'>
                          <Progress
                            variant={getScoreVariant(content.average_rate ?? 0)}
                            value={content.average_rate ?? 0}
                            width='w-5'
                          />
                        </div>
                        <div
                          className={`absolute top-[10px] left-[30px] transform -translate-x-2/3 -translate-y-1/2 z-10 text-white text-xs`}
                        >
                          {content.average_rate}%
                        </div>
                      </div>
                    </div>
                    <div className='mb-2 text-xs italic'> {content.description}</div>
                  </div>
                )
              )}
            </div>
          }
        />
      </Suspense>
    </>
  )
}
