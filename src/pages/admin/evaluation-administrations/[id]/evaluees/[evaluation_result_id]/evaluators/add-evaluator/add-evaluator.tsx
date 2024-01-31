import { AddEvaluatorForm } from "@features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/add-evaluator/add-evaluator-form"
import { AddEvaluatorHeader } from "@features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/add-evaluator/add-evaluator-header"
import { useTitle } from "@hooks/useTitle"

export default function SelectExternalEvaluators() {
  useTitle("Add Evaluator")

  return (
    <div className='flex flex-col gap-5'>
      <AddEvaluatorHeader />
      <AddEvaluatorForm />
    </div>
  )
}
