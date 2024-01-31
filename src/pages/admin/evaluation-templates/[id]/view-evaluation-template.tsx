import { ViewEvaluationTemplateHeader } from "@features/admin/evaluation-templates/[id]/view-evaluation-template-header"
import { ViewEvaluationTemplateTable } from "@features/admin/evaluation-templates/[id]/view-evaluation-template-table"
import { ViewEvaluationTemplateFooter } from "@features/admin/evaluation-templates/[id]/view-evaluation-template-footer"
import { useTitle } from "@hooks/useTitle"

export default function ViewEvaluationTemplate() {
  useTitle("View Evaluation Templates")
  return (
    <div className='flex flex-col gap-12'>
      <ViewEvaluationTemplateHeader />
      <ViewEvaluationTemplateTable />
      <ViewEvaluationTemplateFooter />
    </div>
  )
}
