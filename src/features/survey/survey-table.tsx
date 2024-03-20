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

const mocksurvey_administration = [
  {
    id: 1,
    name: "Sample Survey 1",
    status: "Ready",
    startDate: "2024-03-01",
    endDate: "2024-03-15",
    description: "This is a sample survey for testing purposes.",
    remarks: "Sample remarks",
  },
  {
    id: 2,
    name: "Sample Survey 2",
    status: "Draft",
    startDate: "2024-04-01",
    endDate: "2024-04-15",
    description: "Another sample survey for testing purposes.",
    remarks: "Another sample remarks",
  },
  {
    id: 3,
    name: "Sample Survey 3",
    status: "Ongoing",
    startDate: "2024-04-01",
    endDate: "2024-04-15",
    description: "Another sample survey for testing purposes.",
    remarks: "Another sample remarks",
  },
]

export const SurveyTable = () => {
  const appDispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.surveyAdministration)
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  useEffect(() => {
    void appDispatch(getByTemplateType("No Pending Survey Forms"))
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
      {loading === Loading.Pending && (
        <p className='whitespace-pre-wrap'>{emailTemplate?.content}</p>
      )}
      {
        <>
          {mocksurvey_administration.map((survey) => (
            <Link key={survey.id} to={`/survey_administration/${survey.id}/details`}>
              <div className='flex flex-col items-start gap-4 md:flex-row md:justify-between shadow-md rounded-md p-4 hover:bg-slate-100'>
                <div className='flex flex-col gap-2'>
                  <div className='flex gap-2 items-center'>
                    <h2 className='text-primary-500 text-lg font-semibold'>{survey.name}</h2>
                    <Badge variant={getSurveyStatusVariant(survey?.status)} size='small'>
                      <div className='uppercase'>{survey?.status}</div>
                    </Badge>
                  </div>
                  <div>
                    <p>Survey Period: {formatDateRange(survey.startDate, survey.endDate)}</p>
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
