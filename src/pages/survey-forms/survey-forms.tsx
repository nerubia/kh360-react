import { SurveyFormsHeader } from "@features/survey-forms/survey-forms-header"
import { SurveyFormsList } from "@features/survey-forms/survey-forms-list"
import { useTitle } from "@hooks/useTitle"

export default function SurveyForm() {
  useTitle("Survey Forms")

  return (
    <div className='flex flex-col gap-8'>
      <SurveyFormsHeader />
      <SurveyFormsList />
    </div>
  )
}
