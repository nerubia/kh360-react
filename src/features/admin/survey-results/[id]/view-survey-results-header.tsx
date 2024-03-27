import { useEffect } from "react"
import { useAppSelector } from "@hooks/useAppSelector"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { PageTitle } from "@components/shared/page-title"
import { getSurveyAdministration } from "@redux/slices/survey-administration-slice"
import { DateRangeDisplay } from "@components/shared/display-range-date"
import { useMobileView } from "@hooks/use-mobile-view"
import { Loading } from "@custom-types/loadingType"
import { Spinner } from "@components/ui/spinner/spinner"
import { getResultsByRespondent, getResultsByAnswer } from "@redux/slices/survey-results-slice"
import { getSurveyTemplateQuestions } from "@redux/slices/survey-template-questions-slice"
import { SurveyAdministrationStatus } from "@custom-types/survey-administration-type"

export const ViewSurveyResultsHeader = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, survey_administration } = useAppSelector((state) => state.surveyAdministration)
  const isMobile = useMobileView()

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getSurveyAdministration(parseInt(id)))
      void appDispatch(getResultsByRespondent({ survey_administration_id: id }))
      void appDispatch(getResultsByAnswer({ survey_administration_id: id }))
    }
  }, [])

  useEffect(() => {
    if (survey_administration !== null) {
      void appDispatch(
        getSurveyTemplateQuestions({
          survey_template_id: parseInt(survey_administration.survey_template_id ?? ""),
        })
      )
    }
  }, [survey_administration])

  return (
    <>
      <div className='flex flex-col'>
        {loading === Loading.Pending && (
          <div className='text-center'>
            <Spinner />
          </div>
        )}
        <div className='flex flex-col justify-between items-start md:items-end mt-2 md:flex-row gap-5'>
          {loading === Loading.Fulfilled && survey_administration !== null && (
            <div>
              <div className='flex gap-4 primary-outline items-end mb-4'>
                <PageTitle>Survey Results</PageTitle>
              </div>
              <div className='flex gap-3 font-bold'>{survey_administration?.name}</div>
              <div className='flex gap-3'>
                <DateRangeDisplay
                  label='Survey Schedule'
                  startDate={survey_administration?.survey_start_date ?? ""}
                  endDate={survey_administration?.survey_end_date ?? ""}
                  isMobile={isMobile}
                />
              </div>
              <div className='flex gap-3 mt-4'>{survey_administration?.remarks}</div>
            </div>
          )}
        </div>
        {loading === Loading.Fulfilled &&
          (survey_administration === null ||
            survey_administration?.status !== SurveyAdministrationStatus.Closed) && (
            <div className='mt-10'>Results not found or not available yet.</div>
          )}
      </div>
    </>
  )
}
