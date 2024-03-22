import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useMobileView } from "@hooks/use-mobile-view"
import { setSelectedEmployeeIds } from "@redux/slices/evaluation-administration-slice"
import { getSurveyResults } from "@redux/slices/survey-results-slice"
import { Button } from "@components/ui/button/button"
import { SurveyAdministrationStatus } from "@custom-types/survey-administration-type"
import { Icon } from "@components/ui/icon/icon"

export const ViewSurveyAdminList = () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { survey_administration } = useAppSelector((state) => state.surveyAdministration)
  const { survey_results } = useAppSelector((state) => state.surveyResults)

  const isMobile = useMobileView(1028)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(
        getSurveyResults({
          survey_administration_id: id,
        })
      )
    }
  }, [id])

  const handleAddRespondent = () => {
    appDispatch(setSelectedEmployeeIds([]))
    navigate(`/admin/survey-administrations/${id}/select`)
  }

  return (
    <>
      <div className={`flex flex-col gap-8 mb-4`}>
        <div className={`flex flex-col ${isMobile ? "overflow-x-auto" : ""}`}>
          {survey_results?.map((surveyResult, surveyIndex) => (
            <div key={surveyIndex} className='mb-2 ml-2'>
              - {surveyResult.users?.last_name}, {surveyResult.users?.first_name}
            </div>
          ))}
          <>
            {(survey_administration?.status === SurveyAdministrationStatus.Draft ||
              survey_administration?.status === SurveyAdministrationStatus.Pending ||
              survey_administration?.status === SurveyAdministrationStatus.Ongoing) && (
              <>
                {survey_results.length === 0 ? (
                  <div className='pb-4 pl-2'>
                    No evaluees added yet. Click{" "}
                    <span
                      onClick={handleAddRespondent}
                      className='text-primary-500 cursor-pointer underline'
                    >
                      {" "}
                      here
                    </span>{" "}
                    to add.
                  </div>
                ) : (
                  <div className='flex justify-start py-5'>
                    <Button onClick={handleAddRespondent} variant={"ghost"}>
                      <Icon icon='Plus' size='small' color='primary' />
                      <p className='text-primary-500 uppercase whitespace-nowrap text-sm'>
                        Add Respondent
                      </p>
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        </div>
      </div>
    </>
  )
}
