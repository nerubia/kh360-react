import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import Dialog from "@components/ui/dialog/dialog"
import { Button } from "@components/ui/button/button"
import { type EvaluationResultDetail } from "@custom-types/evaluation-result-detail-type"
import { Progress } from "@components/ui/progress/progress"
import { getScoreVariant } from "@utils/variant"
import { Skeleton } from "@components/ui/skeleton/Skeleton"

export const MyEvaluationResultsTable = () => {
  const { id } = useParams()
  const { loading, user_evaluation_result } = useAppSelector((state) => state.user)
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
      {loading === Loading.Pending && (
        <div>
          <div className='mb-5'>
            <Skeleton className='w-44 h-6' />
          </div>
          <table className='text-sm md:text-lg w-full'>
            <thead className='text-left'>
              <tr>
                <th className='py-1 border-b-4 text-primary-500'>
                  <Skeleton className='w-44 h-5' />
                </th>
                <th className='py-1 border-b-4 text-start text-primary-500'>
                  <Skeleton className='w-44 h-5' />
                </th>
                <th className='py-1 border-b-4 text-start text-primary-500'>
                  <Skeleton className='w-44 h-5' />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className='cursor-pointer hover:bg-slate-100'>
                <td className='py-1 border-b'>
                  <Skeleton className='w-44 h-5' />
                </td>
                <td className='py-1 border-b text-start'>
                  <Skeleton className='w-44 h-5' />
                </td>
                <td className='py-1 border-b text-start items-center'>
                  <Skeleton className='w-44 h-5' />
                </td>
              </tr>
              <tr className='cursor-pointer hover:bg-slate-100'>
                <td className='py-1 border-b'>
                  <Skeleton className='w-44 h-5' />
                </td>
                <td className='py-1 border-b text-start'>
                  <Skeleton className='w-44 h-5' />
                </td>
                <td className='py-1 border-b text-start items-center'>
                  <Skeleton className='w-44 h-5' />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {loading === Loading.Fulfilled && user_evaluation_result === null && <div>Not found</div>}
      {loading === Loading.Fulfilled &&
        user_evaluation_result?.evaluation_result_details !== undefined &&
        user_evaluation_result?.evaluation_result_details.length > 0 &&
        id !== undefined && (
          <div>
            <div className='text-sm md:text-xl text-primary-500 font-bold mb-5'>
              Detailed Evaluation{" "}
            </div>
            <table className='text-sm md:text-lg w-full'>
              <thead className='text-left'>
                <tr>
                  <th className='py-1 border-b-4 text-primary-500'>Evaluations</th>
                  <th className='py-1 border-b-4 text-start text-primary-500'>Score</th>
                  <th className='py-1 border-b-4 text-start text-primary-500'>Rating</th>
                </tr>
              </thead>
              <tbody>
                {user_evaluation_result?.evaluation_result_details.map((detail) => (
                  <React.Fragment key={detail.id}>
                    {Number(detail.weight) !== 0 && (
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
                        {detail.score_rating?.display_name !== null && (
                          <td className='py-1 border-b text-start items-center'>
                            {detail.score_rating?.display_name}
                          </td>
                        )}
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                  <div className='text-primary-500 font-bold w-2/3'>{content.name}</div>
                  <div className='w-600 relative'>
                    <div className='relative z-0'>
                      <Progress
                        variant={getScoreVariant(content.average_rate ?? 0)}
                        value={content.average_rate ?? 0}
                        width='w-5'
                      />
                    </div>
                    <div
                      className={`absolute top-[10px] left-[40px] transform -translate-x-2/3 -translate-y-1/2 z-10  text-white`}
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
