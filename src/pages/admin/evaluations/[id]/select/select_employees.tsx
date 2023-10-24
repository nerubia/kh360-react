import { SelectEmployeesHeader } from "../../../../../features/admin/evaluations/[id]/select/SelectEmployeesHeader"
import { SelectEmployeesFooter } from "../../../../../features/admin/evaluations/[id]/select/SelectEmployeesFooter"
import { SelectEmployeesTable } from "../../../../../features/admin/evaluations/[id]/select/SelectEmployeesTable"
import { SelectEmployeesFilter } from "../../../../../features/admin/evaluations/[id]/select/SelectEmployeesFilter"

export default function SelectEmployees() {
  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <SelectEmployeesHeader />
      <SelectEmployeesFilter />
      <SelectEmployeesTable />
      <SelectEmployeesFooter />
    </div>
  )
}
