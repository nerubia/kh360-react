import { PreviewEvalueesHeader } from "@features/admin/evaluation-administrations/[id]/preview/preview-evaluees-header"
import { PreviewEvalueesTable } from "@features/admin/evaluation-administrations/[id]/preview/preview-evaluees-table"
import { PreviewEvalueesFooter } from "@features/admin/evaluation-administrations/[id]/preview/preview-evaluees-footer"
import { useTitle } from "@hooks/useTitle"

export default function PreviewEmployees() {
  useTitle("Review Evaluees")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <PreviewEvalueesHeader />
      <PreviewEvalueesTable />
      <PreviewEvalueesFooter />
    </div>
  )
}
