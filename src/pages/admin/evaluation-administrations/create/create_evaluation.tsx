import { useTitle } from "../../../../hooks/useTitle"
import { CreateEvaluationHeader } from "../../../../features/admin/evaluation-administrations/create/CreateEvaluationHeader"
import { CreateEvaluationForm } from "../../../../features/admin/evaluation-administrations/create/CreateEvaluationForm"

export default function CreateEvaluation() {
  useTitle("Create Evaluation")

  return (
    <div className='flex flex-col gap-5'>
      <CreateEvaluationHeader />
      <CreateEvaluationForm />
    </div>
  )
}
