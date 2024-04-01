import { PageTitle } from "@components/shared/page-title"
import { useAppSelector } from "@hooks/useAppSelector"
import { Badge } from "@components/ui/badge/badge"
import { getEvaluationResultStatusVariant } from "@utils/variant"

export const SurveyFormHeader = () => {
  const { user_survey_administrations, survey_result_status } = useAppSelector(
    (state) => state.user
  )

  return (
    <div className='flex md:flex-col justify-between gap-4'>
      <div className='flex gap-4 items-center'>
        <PageTitle>{user_survey_administrations[0]?.name}</PageTitle>
        <Badge
          size={"medium"}
          variant={getEvaluationResultStatusVariant(survey_result_status ?? "")}
        >
          <div className='uppercase'>{survey_result_status}</div>
        </Badge>
      </div>
      <div>{user_survey_administrations[0]?.remarks}</div>
    </div>
  )
}
