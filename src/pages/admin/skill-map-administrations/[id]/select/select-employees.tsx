import { SelectEmployeesHeader } from "@features/admin/skill-map-administrations/[id]/select/select-employees-header"
import { SelectEmployeesFilter } from "@features/admin/skill-map-administrations/[id]/select/select-employees-filter"
import { SelectEmployeesTable } from "@features/admin/skill-map-administrations/[id]/select/select-employees-table"
import { SelectEmployeesFooter } from "@features/admin/skill-map-administrations/[id]/select/select-employees-footer"
import { useTitle } from "@hooks/useTitle"

export default function SelectEmployees() {
  useTitle("Select Employees")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <SelectEmployeesHeader />
      <SelectEmployeesFilter />
      <SelectEmployeesTable />
      <SelectEmployeesFooter />
    </div>
  )
}
