import SelectUser from "@components/shared/select-user/select-user"
import { SelectEvalueesHeader } from "@features/admin/evaluation-administrations/[id]/select/select-evaluees-header"
import { SelectEvalueesTable } from "@features/admin/evaluation-administrations/[id]/select/select-evaluees-table"
import { SelectEvalueesFilter } from "@features/admin/evaluation-administrations/[id]/select/select-evaluees-filter"
import { SelectEvalueesFooter } from "@features/admin/evaluation-administrations/[id]/select/select-evaluees-footer"

export default function SelectEvaluees() {
  return (
    <SelectUser
      HeaderComponent={SelectEvalueesHeader}
      FilterComponent={SelectEvalueesFilter}
      TableComponent={SelectEvalueesTable}
      FooterComponent={SelectEvalueesFooter}
      title='Select Evaluees'
      className='h-[calc(100vh_-_104px)] flex flex-col gap-8'
    />
  )
}
