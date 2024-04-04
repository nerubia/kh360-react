import React, { useState, lazy, Suspense } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import { Icon } from "@components/ui/icon/icon"
import { type SurveyAnswer } from "@custom-types/survey-answer-type"
import { ToggleSwitch } from "@components/ui/toggle-switch/toggle-switch"

export const AnswerViewTable = () => {
  const { id } = useParams()
  const { loading, survey_results_answers } = useAppSelector((state) => state.surveyResults)
  const [showDetailsDialog, setShowDetailsDialog] = useState<boolean>(false)
  const [selectedAnswer, setSelectedAnswer] = useState<SurveyAnswer>()
  const [showDetails, setShowDetails] = useState<boolean>(false)

  const ViewSurveyResultsDialog = lazy(
    async () => await import("@features/admin/survey-results/[id]/view-survey-results-dialog")
  )

  const toggleDialog = (selectedAnswer: SurveyAnswer | undefined) => {
    setSelectedAnswer(selectedAnswer)
    setShowDetailsDialog((prev) => !prev)
  }

  const toggleDetails = () => {
    return setShowDetails((prev) => !prev)
  }

  const calculateOverallTotal = () => {
    let overallTotal = 0
    for (const answer of survey_results_answers) {
      if (answer.subTotal !== undefined) {
        overallTotal += answer.subTotal
      }
    }
    return overallTotal
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
              <div className='relative overflow-x-auto'>
                <table className='w-full text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                  <thead className='text-md text-primary-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                      <th scope='col' className='py-3 w-1/3'>
                        Category
                      </th>
                      <th scope='col' className='py-3'>
                        Item
                      </th>
                      <th scope='col' className='py-3 text-center'>
                        Quantity
                      </th>
                      <th scope='col' className='py-3 text-right w-1/20'>
                        Price
                      </th>
                      <th scope='col' className='w-1/30'></th>
                      <th scope='col' className='py-3 w-1/30 text-right'>
                        Subtotal
                      </th>
                      <th scope='col' className='w-1/30'></th>
                      <th scope='col' className='py-3'>
                        <div className='flex gap-4 justify-start'>
                          Details
                          <ToggleSwitch checked={showDetails} onChange={toggleDetails} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {survey_results_answers.map((answer) => (
                      <React.Fragment key={answer.id}>
                        <tr className='hover:bg-slate-100'>
                          <td className='py-1 border-b'>
                            {answer.survey_template_answers?.survey_template_categories?.name}
                          </td>
                          <td className='py-1 border-b'>
                            {answer.survey_template_answers?.answer_text}
                          </td>
                          <td className='py-1 border-b text-center'>
                            {answer.totalCount?.toLocaleString()}
                          </td>
                          <td className='py-1 border-b text-right'>
                            {answer.survey_template_answers?.amount?.toLocaleString()}
                          </td>
                          <td className='py-1 border-b text-right'></td>
                          <td className='py-1 border-b text-right w-1/30'>
                            {answer.subTotal?.toLocaleString()}
                          </td>
                          <td className='py-1 border-b text-right'></td>
                          <td className='py-1 border-b'>
                            {showDetails ? (
                              <div className='ml-2'>
                                {answer?.users?.map((user, index) => (
                                  <div key={index}>
                                    - {user.last_name}, {user.first_name}
                                  </div>
                                ))}
                                {answer?.companion_users?.map((user, index) => (
                                  <div key={index}>
                                    - {user.last_name}, {user.first_name} (Companion of{" "}
                                    {user.related_user?.first_name})
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div
                                className='flex cursor-pointer justify-start'
                                onClick={() => toggleDialog(answer)}
                              >
                                <Icon icon='Info' size='extraSmall' color='primary' />
                              </div>
                            )}
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
                      {selectedAnswer?.companion_users?.map((user, index) => (
                        <div key={index}>
                          - {user.last_name}, {user.first_name} (Companion of{" "}
                          {user.related_user?.first_name})
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
      {calculateOverallTotal() > 0 && (
        <div className='flex justify-start mt-2 text-gray-500'>
          <b>{`Overall Total: ₱${calculateOverallTotal().toLocaleString()}`}</b>
        </div>
      )}
    </>
  )
}
