import { PreviewEmployeesHeader } from "../../../../../features/admin/evaluations/[id]/preview/PreviewEmployeesHeader"
import { PreviewEmployeesTable } from "../../../../../features/admin/evaluations/[id]/preview/PreviewEmployeesTable"
import { PreviewEmployeesFooter } from "../../../../../features/admin/evaluations/[id]/preview/PreviewEmployeesFooter"

export default function PreviewEmployees() {
  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <PreviewEmployeesHeader />
      <PreviewEmployeesTable />
      <PreviewEmployeesFooter />
    </div>
  )
}
