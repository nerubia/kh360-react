import { useTitle } from "../../../../hooks/useTitle"
import { CreateEvaluationForm } from "../../../../features/admin/evaluations/create/CreateEvaluationForm"

export default function CreateEvaluation() {
  useTitle("Create Evaluation")

  return (
    <div className='flex flex-col'>
      <CreateEvaluationForm />
    </div>
  )
}
