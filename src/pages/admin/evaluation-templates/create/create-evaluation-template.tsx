import { CreateEvaluationTemplateForm } from "../../../../features/admin/evaluation-templates/evaluation-template-form/evaluation-template-form"
import { CreateEvaluationTemplateHeader } from "../../../../features/admin/evaluation-templates/evaluation-template-form/evaluation-template-header"
import { useTitle } from "../../../../hooks/useTitle"

export default function CreateEvaluationTemplate() {
  useTitle("Create Evaluation")

  return (
    <div className='flex flex-col gap-5'>
      <CreateEvaluationTemplateHeader />
      <CreateEvaluationTemplateForm />
    </div>
  )
}
