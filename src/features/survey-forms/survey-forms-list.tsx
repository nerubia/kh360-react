import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { formatDateRange } from "@utils/format-date"
import { Spinner } from "@components/ui/spinner/spinner"
import { getByTemplateType, getByTemplateTypeSocket } from "@redux/slices/email-template-slice"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"
import { Badge } from "@components/ui/badge/badge"
import { getSurveyStatusVariant } from "@utils/variant"
import { Loading } from "@custom-types/loadingType"
import { getUserSurveyAdministrations } from "@redux/slices/survey-administrations-slice"

export const SurveyFormsList = () => {
  const appDispatch = useAppDispatch()
  const { loading, user_survey_administrations } = useAppSelector(
    (state) => state.surveyAdministrations
  )
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  useEffect(() => {
    void appDispatch(getByTemplateType("No Pending Survey Forms"))
    void appDispatch(getUserSurveyAdministrations())
  }, [])

  useEffect(() => {
    void appDispatch(getByTemplateTypeSocket("No Pending Survey Forms"))
  }, [lastJsonMessage])

  return (
    <div className='flex flex-col gap-8'>
      {loading === Loading.Pending && (
        <div className='text-center'>
          <Spinner />
        </div>
      )}
      {loading === Loading.Fulfilled && user_survey_administrations?.length === 0 && (
        <p className='whitespace-pre-wrap'>{emailTemplate?.content}</p>
      )}
      {
        <>
          {user_survey_administrations.map((survey) => (
            <Link key={survey.id} to={`/survey-forms/${survey.id}`}>
              <div className='flex flex-col items-start gap-4 md:flex-row md:justify-between shadow-md rounded-md p-4 hover:bg-slate-100'>
                <div className='flex flex-col gap-2'>
                  <div className='flex gap-2 items-center'>
                    <h2 className='text-primary-500 text-lg font-semibold'>{survey.name}</h2>
                    <Badge variant={getSurveyStatusVariant(survey?.status)} size='small'>
                      <div className='uppercase'>{survey?.status}</div>
                    </Badge>
                  </div>
                  <div>
                    <p>
                      Survey Period:{" "}
                      {formatDateRange(survey.survey_start_date, survey.survey_end_date)}
                    </p>
                    <p>{survey.remarks}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </>
      }
    </div>
  )
}
