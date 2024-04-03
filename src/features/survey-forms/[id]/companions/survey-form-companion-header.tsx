import { useEffect } from "react"
import { PageTitle } from "@components/shared/page-title"
import { useAppSelector } from "@hooks/useAppSelector"
import { Badge } from "@components/ui/badge/badge"
import { getSurveyResultStatusVariant } from "@utils/variant"
import { useNavigate } from "react-router-dom"
import { SurveyAdministrationStatus } from "@custom-types/survey-administration-type"

export const SurveyFormCompanionHeader = () => {
  const navigate = useNavigate()
  const { user_survey_administrations, survey_result_status, user_survey_companion } =
    useAppSelector((state) => state.user)

  const handleRedirect = () => {
    navigate("/survey-forms")
  }

  useEffect(() => {
    if (user_survey_administrations[0] !== undefined) {
      if (user_survey_administrations[0]?.status !== SurveyAdministrationStatus.Ongoing) {
        handleRedirect()
      }
    }
  }, [user_survey_administrations])

  return (
    <div className='flex md:flex-col justify-between gap-4'>
      <div className='flex gap-4 items-center'>
        <PageTitle>
          {user_survey_companion?.last_name}, {user_survey_companion?.first_name}
        </PageTitle>
        <Badge size={"medium"} variant={getSurveyResultStatusVariant(survey_result_status ?? "")}>
          <div className='uppercase'>{survey_result_status}</div>
        </Badge>
      </div>
    </div>
  )
}
