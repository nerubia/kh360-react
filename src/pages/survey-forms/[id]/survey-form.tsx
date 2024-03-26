import { SurveyFormHeader } from "@features/survey-forms/[id]/survey-form-header"
import { SurveyFormTable } from "@features/survey-forms/[id]/survey-form-table"
import { useTitle } from "@hooks/useTitle"

export default function SurveyForm() {
  useTitle("Survey Form")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8 justify-evenly'>
      <SurveyFormHeader />
      <SurveyFormTable />
    </div>
  )
}
