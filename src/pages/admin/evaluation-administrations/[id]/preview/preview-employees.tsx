import { PreviewEmployeesHeader } from "@features/admin/evaluation-administrations/[id]/preview/preview-employees-header"
import { PreviewEmployeesTable } from "@features/admin/evaluation-administrations/[id]/preview/preview-employees-table"
import { PreviewEmployeesFooter } from "@features/admin/evaluation-administrations/[id]/preview/preview-employees-footer"
import { useTitle } from "@hooks/useTitle"

export default function PreviewEmployees() {
  useTitle("Review Employees")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <PreviewEmployeesHeader />
      <PreviewEmployeesTable />
      <PreviewEmployeesFooter />
    </div>
  )
}
