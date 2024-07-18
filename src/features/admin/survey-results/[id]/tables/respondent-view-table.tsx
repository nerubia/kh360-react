import React from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import Tooltip from "@components/ui/tooltip/tooltip"
import { Icon } from "@components/ui/icon/icon"
import { type SurveyAnswer } from "@custom-types/survey-answer-type"
import { Badge } from "@components/ui/badge/badge"
import { getEvaluationAdministrationStatusVariant } from "@utils/variant"

export const RespondentViewTable = () => {
  const { id } = useParams()
  const { loading, survey_results, companion_survey_results } = useAppSelector(
    (state) => state.surveyResults
  )
  const { survey_template_questions } = useAppSelector((state) => state.surveyTemplateQuestions)

  const getTotalAmount = (answers: SurveyAnswer[] | undefined) => {
    if (answers !== undefined) {
      let totalAmount = 0

      for (const answer of answers) {
        totalAmount += parseInt(answer.survey_template_answers?.amount as string)
      }

      return totalAmount.toLocaleString()
    }
  }
  const calculateTotal = (answers: SurveyAnswer[] | undefined) => {
    if (answers == null) return 0

    let totalAmount = 0

    for (const answer of answers) {
      totalAmount += parseInt(answer.survey_template_answers?.amount as string)
    }

    return totalAmount
  }
  const surveyTotal = () => {
    let surveyTotal = 0

    if (survey_results !== undefined && survey_results !== null) {
      surveyTotal = survey_results.reduce((total, result) => {
        return total + calculateTotal(result.survey_answers)
      }, 0)
    }

    return surveyTotal
  }
  const companionTotal = () => {
    let companionTotal = 0

    if (companion_survey_results !== undefined && companion_survey_results !== null) {
      companionTotal = companion_survey_results.reduce((total, result) => {
        return total + calculateTotal(result.survey_answers)
      }, 0)
    }
    return companionTotal.toLocaleString()
  }
  const overAllTotalAmount = () => {
    const surveyTotalValue = Number(surveyTotal())
    const companionTotalValue = Number(companionTotal())

    const overallTotal = surveyTotalValue + companionTotalValue

    return overallTotal.toLocaleString()
  }
  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && survey_results === null && <div>Not found</div>}
      <div className='overflow-hidden'>
        {loading === Loading.Fulfilled &&
          survey_results !== undefined &&
          survey_results.length > 0 &&
          id !== undefined && (
            <>
              <div className='relative overflow-y-hidden overflow-x-hidden'>
                <table className='w-full text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                  <thead className='text-md text-primary-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                      <th scope='col' className='p-2 w-1/30'>
                        ID
                      </th>
                      <th scope='col' className='p-2'>
                        Name
                      </th>
                      <th scope='col' className='p-2 w-1/12'>
                        Status
                      </th>
                      <th scope='col' className='p-2'>
                        {survey_template_questions.map((question) => (
                          <div className='flex gap-2 break-word' key={question.id}>
                            <p>Question {question.sequence_no}</p>
                            <Tooltip placement='bottomStart'>
                              <Tooltip.Trigger>
                                <Icon icon='Info' size='extraSmall' />
                              </Tooltip.Trigger>
                              <Tooltip.Content>
                                <pre className='font-sans whitespace-pre-wrap break-words text-left w-56'>
                                  {question.question_text}
                                </pre>
                              </Tooltip.Content>
                            </Tooltip>
                          </div>
                        ))}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {survey_results.map((result, index) => (
                      <React.Fragment key={result.id}>
                        <tr className='hover:bg-slate-100 text-sm'>
                          <td className='p-2 border-b w-1/30'>{index + 1}</td>
                          <td className='p-2 border-b w-2/12'>
                            {result.users?.last_name}, {result.users?.first_name}
                          </td>
                          <td className='p-2 border-b w-1/12'>
                            <Badge
                              variant={getEvaluationAdministrationStatusVariant(result.status)}
                              size='small'
                            >
                              {result.status}
                            </Badge>
                          </td>
                          <td className='p-2 border-b w-1/6'>
                            <div className='flex flex-col gap-2'>
                              {result.survey_answers?.length === 0 ? (
                                <>No answer</>
                              ) : (
                                <>
                                  {result.survey_answers?.map((answer, index) => (
                                    <div key={index}>
                                      - {answer.survey_template_answers?.answer_text}
                                    </div>
                                  ))}
                                  <span>
                                    Total Amount: <b>₱{getTotalAmount(result.survey_answers)}</b>
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                {surveyTotal() > 0 && (
                  <div className='flex justify-start mt-2 text-gray-500'>
                    <b>{`Total Amount (Respondent): ₱${surveyTotal().toLocaleString()}`}</b>
                  </div>
                )}
              </div>
              <div className='mt-5 flex flex-col gap-4 overflow-y-hidden overflow-x-hidden'>
                {companion_survey_results.length > 0 && (
                  <>
                    <p className='text-primary-500 font-bold text-lg'>Companions</p>
                    <div className='relative'>
                      <table className='w-full text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead className='text-md text-primary-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                          <tr>
                            <th scope='col' className='p-2 w-1/30'>
                              ID
                            </th>
                            <th scope='col' className='p-2'>
                              Name
                            </th>
                            <th scope='col' className='p-2'>
                              Companion of
                            </th>
                            <th scope='col' className='p-2 w-1/12'>
                              Status
                            </th>
                            <th scope='col' className='p-2'>
                              {survey_template_questions.map((question) => (
                                <div className='flex gap-2 break-word' key={question.id}>
                                  <p>Question {question.sequence_no}</p>
                                  <Tooltip placement='bottomStart'>
                                    <Tooltip.Trigger>
                                      <Icon icon='Info' size='extraSmall' />
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>
                                      <pre className='font-sans whitespace-pre-wrap break-words text-left w-56'>
                                        {question.question_text}
                                      </pre>
                                    </Tooltip.Content>
                                  </Tooltip>
                                </div>
                              ))}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {companion_survey_results.map((result, index) => (
                            <React.Fragment key={result.id}>
                              <tr className='hover:bg-slate-100 text-sm'>
                                <td className='p-2 border-b w-1/30'>{index + 1}</td>
                                <td className='p-2 border-b w-2/12'>
                                  {result.companion_user?.last_name},{" "}
                                  {result.companion_user?.first_name}
                                </td>
                                <td className='p-2 border-b w-1/12'>
                                  {result.users?.last_name}, {result.users?.first_name}
                                </td>
                                <td className='p-2 border-b w-1/12'>
                                  <Badge
                                    variant={getEvaluationAdministrationStatusVariant(
                                      result.status
                                    )}
                                    size='small'
                                  >
                                    {result.status}
                                  </Badge>
                                </td>
                                <td className='p-2 border-b w-1/6'>
                                  <div className='flex flex-col gap-2'>
                                    {result.survey_answers?.length === 0 ? (
                                      <>No answer</>
                                    ) : (
                                      <>
                                        {result.survey_answers?.map((answer, index) => (
                                          <div key={index}>
                                            - {answer.survey_template_answers?.answer_text}
                                          </div>
                                        ))}
                                        <span>
                                          Total Amount:{" "}
                                          <b>₱{getTotalAmount(result.survey_answers)}</b>
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                      <div className='flex justify-start mt-2 text-gray-500'>
                        <b>{`Total Amount (Companion): ₱${companionTotal().toLocaleString()}`}</b>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
      </div>
      {parseInt(overAllTotalAmount()) > 0 && (
        <div className='flex justify-start mt-2 text-gray-500'>
          <b>{`Overall total: ₱${overAllTotalAmount().toLocaleString()}`}</b>
        </div>
      )}
    </>
  )
}
