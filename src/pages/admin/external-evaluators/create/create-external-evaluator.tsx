import { ExternalEvaluatorForm } from "@features/admin/external-evaluators/external-evaluator-form/external-evaluator-form"
import { ExternalEvaluatorHeader } from "@features/admin/external-evaluators/external-evaluator-form/external-evaluator-header"
import { useTitle } from "@hooks/useTitle"

export default function CreateExternalEvaluator() {
  useTitle("Add External Evaluator")

  return (
    <div className='flex flex-col gap-5'>
      <ExternalEvaluatorHeader title='Add External Evaluator' />
      <ExternalEvaluatorForm />
    </div>
  )
}
