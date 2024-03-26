import { PageTitle } from "@components/shared/page-title"
import { useAppSelector } from "@hooks/useAppSelector"

export const SurveyFormHeader = () => {
  const { user_survey_administrations } = useAppSelector((state) => state.user)

  return (
    <div className='flex flex-col justify-between gap-4'>
      <PageTitle>{user_survey_administrations[0]?.name}</PageTitle>
      <div>{user_survey_administrations[0]?.remarks}</div>
    </div>
  )
}
