import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import Dialog from "@components/ui/dialog/dialog"
import { Button } from "@components/ui/button/button"
import { type EvaluationResultDetail } from "@custom-types/evaluation-result-detail-type"
import { Progress } from "@components/ui/progress/progress"
import { getScoreVariant } from "@utils/variant"

export const ViewEvaluationResultsTable = () => {
  const { id } = useParams()
  const { loading, evaluation_result } = useAppSelector((state) => state.evaluationResult)
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [selectedEvaluationResultDetail, setSelectedEvaluationResultDetail] =
    useState<EvaluationResultDetail>()

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
              <div className='overflow-x-auto md:overflow-x-hidden'>
                <table className='w-full md:w-[950px] md:table-fixed whitespace-nowrap'>
                  <thead className='text-left'>
                    <tr>
                      <th className='py-1 border-b-4 text-primary-500 px-2 md:w-1/4'>
                        Evaluations
                      </th>
                      <th className='py-1 border-b-4 text-center text-primary-500 px-2 md:w-1/6'>
                        Score
                      </th>
                      <th className='py-1 border-b-4 text-start text-primary-500 px-2 md:w-1/4'>
                        Rating
                      </th>
                      <th className='py-1 border-b-4 text-start text-primary-500 px-2 md:w-1/6'>
                        Standard Score
                      </th>
                      <th className='py-1 border-b-4 text-start text-primary-500 px-2 w-1/4'>
                        Banding
                      </th>
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
                            <td className='py-1 px-2 border-b w-1/4'>{detail.template_name}</td>
                            <td className='py-1 px-2 border-b text-center w-1/6'>
                              {detail.total_score}%
                            </td>
                            {detail.score_rating?.display_name !== null && (
                              <td className='py-1 px-2 border-b text-start items-center w-1/5'>
                                {detail.score_rating?.display_name}
                              </td>
                            )}
                            <td className='py-1 px-2 border-b text-start items-center w-1/6'>
                              {Number(detail.zscore).toFixed(2)}
                            </td>
                            <td className='py-1 px-2 border-b text-start items-center w-1/4'>
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
      <Dialog open={showDetails} size={"medium"} maxWidthMin={true}>
        <Dialog.Title>
          <div className='py-1 text-primary-500'>
            {selectedEvaluationResultDetail?.template_name} Score:{" "}
            {selectedEvaluationResultDetail?.total_score}%
          </div>
        </Dialog.Title>
        <Dialog.Description>
          <div className='overflow-auto'>
            {selectedEvaluationResultDetail?.evaluation_template_contents?.map((content, index) => (
              <div key={index} className='hover:bg-slate-100 p-2'>
                <div className='flex justify-between mb-2 flex-col md:flex-row overflow-x-hidden'>
                  <div className='text-primary-500 font-bold w-2/3'>{content.name}</div>
                  <div className='w-[600px] relative'>
                    <div className='relative z-0 w-[45%] md:w-[100%]'>
                      <Progress
                        variant={getScoreVariant(content.average_rate ?? 0)}
                        value={content.average_rate ?? 0}
                        width='w-[20px]'
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
            ))}
          </div>
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primary' onClick={toggleDetails}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
