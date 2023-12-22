import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Loading } from "../../../types/loadingType"
import Dialog from "../../../components/ui/dialog/dialog"
import { Button } from "../../../components/ui/button/button"
import { type EvaluationResultDetail } from "../../../types/evaluation-result-detail-type"
import { Progress } from "../../../components/ui/progress/progress"
import { getScoreVariant } from "../../../utils/variant"

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
              <div className='text-xl text-primary-500 font-bold mb-5'>Detailed Evaluation </div>
              <table className='md:w-[860px] table-fixed'>
                <thead className='text-left'>
                  <tr>
                    <th className='py-1 border-b-4 text-primary-500'>Evaluations</th>
                    <th className='py-1 border-b-4 text-start text-primary-500'>Score</th>
                    <th className='py-1 border-b-4 text-start text-primary-500'>Rating</th>
                    <th className='py-1 border-b-4 text-center text-primary-500'>Standard Score</th>
                    <th className='py-1 border-b-4 text-start text-primary-500'>Banding</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluation_result?.evaluation_result_details.map((detail) => (
                    <tr
                      key={detail.id}
                      className='cursor-pointer hover:bg-slate-100'
                      onClick={() => {
                        handleOpenDetails(detail)
                        toggleDetails()
                      }}
                    >
                      <td className='py-1 border-b'>{detail.template_name}</td>
                      <td className='py-1 border-b text-start'>{detail.total_score}%</td>
                      <td className='py-1 border-b text-start items-center'>
                        {detail.score_rating.display_name}
                      </td>
                      <td className='py-1 border-b text-center items-center'>
                        {Number(detail.zscore).toFixed(2)}
                      </td>
                      <td className='py-1 border-b text-start items-center'>{detail.banding}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <div className='flex justify-between mb-2'>
                  <div className='text-primary-500 font-bold w-1/2'>{content.name}</div>
                  <div className='w-[300px] relative'>
                    <div className='relative z-0'>
                      <Progress
                        variant={getScoreVariant(content.average_rate ?? 0)}
                        value={content.average_rate ?? 0}
                        width='w-[20px]'
                      />
                    </div>
                    <div
                      className={`absolute top-[10px] right-3/4 transform -translate-x-1/2 -translate-y-1/2 z-10  text-white`}
                    >
                      {content.average_rate}%
                    </div>
                  </div>
                </div>
                <div className='mb-2 text-sm italic'> {content.description}</div>
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