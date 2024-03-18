import { PreviewRespondentsHeader } from "@features/admin/survey-administrations/[id]/preview/preview-respondents-header"
import { PreviewRespondentsTable } from "@features/admin/survey-administrations/[id]/preview/preview-respondents-table"
import { PreviewRespondentsFooter } from "@features/admin/survey-administrations/[id]/preview/preview-respondents-footer"
import { useTitle } from "@hooks/useTitle"

export default function PreviewEmployees() {
  useTitle("Review Respondents")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <PreviewRespondentsHeader />
      <PreviewRespondentsTable />
      <PreviewRespondentsFooter />
    </div>
  )
}
