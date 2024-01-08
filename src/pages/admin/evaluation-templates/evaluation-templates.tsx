import { EvaluationTemplatesAction } from "../../../features/admin/evaluation-templates/evaluation-templates-action"
import { EvaluationTemplatesFilter } from "../../../features/admin/evaluation-templates/evaluation-templates-filter"
import { EvaluationTemplatesHeader } from "../../../features/admin/evaluation-templates/evaluation-templates-header"
import { EvaluationTemplatesTable } from "../../../features/admin/evaluation-templates/evaluation-templates-table"
import { useTitle } from "../../../hooks/useTitle"

export default function EvaluationTemplates() {
  useTitle("Evaluation Templates")

  return (
    <div className='flex flex-col gap-8'>
      <EvaluationTemplatesHeader />
      <EvaluationTemplatesFilter />
      <EvaluationTemplatesAction />
      <EvaluationTemplatesTable />
    </div>
  )
}
