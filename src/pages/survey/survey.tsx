import { SurveyHeader } from "@features/survey/survey-header"
import { SurveyTable } from "@features/survey/survey-table"
import { useTitle } from "@hooks/useTitle"

export default function EvaluationAdministrations() {
  useTitle("Survey Forms")

  return (
    <div className='flex flex-col gap-8'>
      <SurveyHeader />
      <SurveyTable />
    </div>
  )
}
