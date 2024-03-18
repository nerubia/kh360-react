import { useTitle } from "@hooks/useTitle"
import { CreateSurveyAdministrationHeader } from "@features/admin/survey-administrations/create/create-survey-administration-header"
import { SurveyAdministrationForm } from "@features/admin/survey-administrations/survey-administration-form"

export default function CreateEvaluation() {
  useTitle("Create Survey")

  return (
    <div className='flex flex-col gap-5'>
      <CreateSurveyAdministrationHeader />
      <SurveyAdministrationForm />
    </div>
  )
}
