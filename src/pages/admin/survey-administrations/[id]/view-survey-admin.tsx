import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import {
  getSurveyAdministration,
  getSurveyAdministrationSocket,
} from "@redux/slices/survey-administration-slice"
import { Loading } from "@custom-types/loadingType"
import { ViewSurveyAdminHeader } from "@features/admin/survey-administrations/[id]/view-survey-admin-header"
import { ViewSurveyAdminList } from "@features/admin/survey-administrations/[id]/view-survey-admin-list"
import { ViewSurveyAdminFooter } from "@features/admin/survey-administrations/[id]/view-survey-admin-footer"
import { useTitle } from "@hooks/useTitle"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"
import { Spinner } from "@components/ui/spinner/spinner"

export default function ViewSurveyAdministration() {
  useTitle("View Survey Administration")

  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, survey_administration } = useAppSelector((state) => state.surveyAdministration)
  const { loading: loading_survey_results, survey_results } = useAppSelector(
    (state) => state.surveyResults
  )
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getSurveyAdministration(parseInt(id)))
    }
  }, [id])

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getSurveyAdministrationSocket(parseInt(id)))
    }
  }, [lastJsonMessage])

  return (
    <div className='flex flex-col gap-2'>
      {loading === Loading.Pending && survey_administration === null && <div>Loading...</div>}
      {loading === Loading.Fulfilled && survey_administration === null && <div>Not found</div>}
      <div className='h-[calc(100vh_-_104px)] flex flex-col gap-2' id='scroll-container'>
        {survey_administration !== null && (
          <>
            <ViewSurveyAdminHeader />
            {loading_survey_results === Loading.Pending && <Spinner />}
            {loading_survey_results === Loading.Fulfilled && survey_results === null && (
              <div>Not found</div>
            )}
            {survey_results !== null && <ViewSurveyAdminList />}
          </>
        )}
        <ViewSurveyAdminFooter />
      </div>
    </div>
  )
}
