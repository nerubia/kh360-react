import { CreateExternalEvaluatorForm } from "../../../../features/admin/external-evaluators/create/create-external-evaluator-form"
import { CreateExternalEvaluatorHeader } from "../../../../features/admin/external-evaluators/create/create-external-evaluator-header"
import { useTitle } from "../../../../hooks/useTitle"

export default function CreateExternalEvaluator() {
  useTitle("Add External Evaluator")

  return (
    <div className='flex flex-col gap-5'>
      <CreateExternalEvaluatorHeader />
      <CreateExternalEvaluatorForm />
    </div>
  )
}
