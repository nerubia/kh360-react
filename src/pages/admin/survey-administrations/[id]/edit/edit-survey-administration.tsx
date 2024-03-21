import { useTitle } from "@hooks/useTitle"
import { EditSurveyAdministrationHeader } from "@features/admin/survey-administrations/[id]/edit/edit-survey-administration-header"
import { SurveyAdministrationForm } from "@features/admin/survey-administrations/survey-administration-form"

export default function EditSurveyAdministration() {
  useTitle("Edit Survey")

  return (
    <div className='flex flex-col gap-5'>
      <EditSurveyAdministrationHeader />
      <SurveyAdministrationForm />
    </div>
  )
}
