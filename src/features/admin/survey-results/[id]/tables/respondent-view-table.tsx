import React from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import Tooltip from "@components/ui/tooltip/tooltip"
import { Icon } from "@components/ui/icon/icon"
import { type SurveyAnswer } from "@custom-types/survey-answer-type"

export const RespondentViewTable = () => {
  const { id } = useParams()
  const { loading, survey_results } = useAppSelector((state) => state.surveyResults)
  const { survey_template_questions } = useAppSelector((state) => state.surveyTemplateQuestions)

  const getTotalAmount = (answers: SurveyAnswer[] | undefined) => {
    if (answers !== undefined) {
      let totalAmount = 0

      for (const answer of answers) {
        totalAmount += parseInt(answer.survey_template_answers?.amount as string)
      }

      return totalAmount
    }
  }

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && survey_results === null && <div>Not found</div>}
      <div>
        {loading === Loading.Fulfilled &&
          survey_results !== undefined &&
          survey_results.length > 0 &&
          id !== undefined && (
            <>
              <div className='overflow-x-auto'>
                <table className='w-full md:w-4/5 whitespace-nowrap'>
                  <thead>
                    <tr>
                      <th className='py-1 border-b-4 text-primary-500 px-2 md:w-1/4'>Name</th>
                      <>
                        <th className='py-1 border-b-4 text-primary-500 px-2 md:w-56'>
                          {survey_template_questions.map((question) => (
                            <div
                              className='flex items-center justify-center gap-2 break-word'
                              key={question.id}
                            >
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
                      </>
                    </tr>
                  </thead>
                  <tbody>
                    {survey_results.map((result) => (
                      <React.Fragment key={result.id}>
                        <tr className='hover:bg-slate-100'>
                          <td className='py-1 px-2 border-b w-1/4 text-center'>
                            {result.users?.last_name}, {result.users?.first_name}
                          </td>
                          <td className='py-1 px-2 border-b text-center w-1/6'>
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
                                    Total Amount: <b>{getTotalAmount(result.survey_answers)}</b>
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
              </div>
            </>
          )}
      </div>
    </>
  )
}
