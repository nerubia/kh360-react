import { SelectEvalueesHeader } from "../../../../../features/admin/evaluation-administrations/[id]/select/select-evaluees-header"
import { SelectEvalueesTable } from "../../../../../features/admin/evaluation-administrations/[id]/select/select-evaluees-table"
import { SelectEvalueesFilter } from "../../../../../features/admin/evaluation-administrations/[id]/select/select-evaluees-filter"
import { SelectEvalueesFooter } from "../../../../../features/admin/evaluation-administrations/[id]/select/select-evaluees-footer"
import { useTitle } from "../../../../../hooks/useTitle"

export default function SelectEvaluees() {
  useTitle("Select Evaluees")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <SelectEvalueesHeader />
      <SelectEvalueesFilter />
      <SelectEvalueesTable />
      <SelectEvalueesFooter />
    </div>
  )
}
