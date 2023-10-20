import { SelectEmployeesHeader } from "../../../../../features/admin/evaluations/select/SelectEmployeesHeader"
import { SelectEmployeesFooter } from "../../../../../features/admin/evaluations/select/SelectEmployeesFooter"
import { SelectEmployeesTable } from "../../../../../features/admin/evaluations/select/SelectEmployeesTable"
import { SelectEmployeesFilter } from "../../../../../features/admin/evaluations/select/SelectEmployeesFilter"

export default function SelectEmployees() {
  return (
    <div className='flex flex-col gap-8'>
      <SelectEmployeesHeader />
      <SelectEmployeesFilter />
      <SelectEmployeesTable />
      <SelectEmployeesFooter />
    </div>
  )
}
