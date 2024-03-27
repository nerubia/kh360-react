import React, { useState, lazy, Suspense } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
// import Tooltip from "@components/ui/tooltip/tooltip"
import { Icon } from "@components/ui/icon/icon"
import { type SurveyAnswer } from "@custom-types/survey-answer-type"

export const AnswerViewTable = () => {
  const { id } = useParams()
  const { loading, survey_results_answers } = useAppSelector((state) => state.surveyResults)
  const [showDetailsDialog, setShowDetailsDialog] = useState<boolean>(false)
  const [selectedAnswer, setSelectedAnswer] = useState<SurveyAnswer>()

  const ViewSurveyResultsDialog = lazy(
    async () => await import("@features/admin/survey-results/[id]/view-survey-results-dialog")
  )

  const toggleDialog = (selectedAnswer: SurveyAnswer | undefined) => {
    setSelectedAnswer(selectedAnswer)
    setShowDetailsDialog((prev) => !prev)
  }

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && survey_results_answers.length === 0 && (
        <div>No answers found</div>
      )}
      <div>
        {loading === Loading.Fulfilled &&
          survey_results_answers !== undefined &&
          survey_results_answers.length > 0 &&
          id !== undefined && (
            <>
              <div className='overflow-x-auto'>
                <table className='w-full whitespace-nowrap'>
                  <thead>
                    <tr>
                      <th className='py-1 border-b-4 text-primary-500 px-2 md:w-1/4'>Item</th>
                      <th className='py-1 border-b-4 text-primary-500 px-2 md:w-1/4'>Quantity</th>
                      <th className='py-1 border-b-4 text-primary-500 px-2 md:w-/4'>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {survey_results_answers.map((answer) => (
                      <React.Fragment key={answer.id}>
                        <tr className='hover:bg-slate-100'>
                          <td className='py-1 px-2 border-b w-1/4 text-center'>
                            {answer.survey_template_answers?.answer_text}
                          </td>
                          <td className='py-1 px-2 border-b w-1/4 text-center'>
                            {answer.totalCount}
                          </td>
                          <td className='py-1 px-2 border-b w-1/4 text-center'>
                            <div
                              className='flex items-center justify-center cursor-pointer'
                              onClick={() => toggleDialog(answer)}
                            >
                              <Icon icon='Info' size='extraSmall' color='primary' />
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <Suspense>
                <ViewSurveyResultsDialog
                  open={showDetailsDialog}
                  title={selectedAnswer?.survey_template_answers?.answer_text}
                  description={
                    <>
                      {selectedAnswer?.users?.map((user, index) => (
                        <div key={index}>
                          - {user.last_name}, {user.first_name}
                        </div>
                      ))}
                    </>
                  }
                  showCloseButton={false}
                  submitButtonLabel='Close'
                  onSubmit={() => toggleDialog(undefined)}
                />
              </Suspense>
            </>
          )}
      </div>
    </>
  )
}
