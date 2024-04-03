import { SurveyFormCompanionHeader } from "@features/survey-forms/[id]/companions/survey-form-companion-header"
import { SurveyFormCompanionTable } from "@features/survey-forms/[id]/companions/survey-form-companion-table"
import { useTitle } from "@hooks/useTitle"

export default function SurveyForm() {
  useTitle("Survey Form Companion")

  return (
    <div className='flex flex-col gap-8 justify-evenly'>
      <SurveyFormCompanionHeader />
      <SurveyFormCompanionTable />
    </div>
  )
}
