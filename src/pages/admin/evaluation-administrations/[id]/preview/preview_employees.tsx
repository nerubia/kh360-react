import { PreviewEmployeesHeader } from "../../../../../features/admin/evaluation-administrations/[id]/preview/PreviewEmployeesHeader"
import { PreviewEmployeesTable } from "../../../../../features/admin/evaluation-administrations/[id]/preview/preview-employees-table"
import { PreviewEmployeesFooter } from "../../../../../features/admin/evaluation-administrations/[id]/preview/preview-employees-footer"

export default function PreviewEmployees() {
  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <PreviewEmployeesHeader />
      <PreviewEmployeesTable />
      <PreviewEmployeesFooter />
    </div>
  )
}
