import { SurveyFormsHeader } from "@features/survey/survey-forms-header"
import { SurveyFormsList } from "@features/survey/survey-forms-list"
import { useTitle } from "@hooks/useTitle"

export default function EvaluationAdministrations() {
  useTitle("Survey Forms")

  return (
    <div className='flex flex-col gap-8'>
      <SurveyFormsHeader />
      <SurveyFormsList />
    </div>
  )
}
