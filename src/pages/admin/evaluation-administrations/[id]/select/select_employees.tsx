import { SelectEmployeesHeader } from "../../../../../features/admin/evaluation-administrations/[id]/select/SelectEmployeesHeader"
import { SelectEmployeesFooter } from "../../../../../features/admin/evaluation-administrations/[id]/select/SelectEmployeesFooter"
import { SelectEmployeesTable } from "../../../../../features/admin/evaluation-administrations/[id]/select/select-employees-table"
import { SelectEmployeesFilter } from "../../../../../features/admin/evaluation-administrations/[id]/select/select-employees-filter"

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
