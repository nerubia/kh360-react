import { SurveyFormHeader } from "@features/survey-forms/[id]/survery-form-header"
import { SurveyFormTable } from "@features/survey-forms/[id]/survey-form-table"
import { useTitle } from "@hooks/useTitle"

export default function SurveyForm() {
  useTitle("Survey Form")

  return (
    <div className='flex flex-col gap-8'>
      <SurveyFormHeader />
      <SurveyFormTable />
    </div>
  )
}
