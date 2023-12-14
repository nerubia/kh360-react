import { EvalueesList } from "../../../../../features/admin/evaluation-administrations/[id]/evaluees/evaluees-list"
import { EvalueesFilter } from "../../../../../features/admin/evaluation-administrations/[id]/evaluees/evaluees-filter"
import { EvalueesFooter } from "../../../../../features/admin/evaluation-administrations/[id]/evaluees/evaluees-footer"
import { EvalueesHeader } from "../../../../../features/admin/evaluation-administrations/[id]/evaluees/evaluees-header"

export default function Evaluees() {
  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <EvalueesHeader />
      <EvalueesFilter />
      <EvalueesList />
      <EvalueesFooter />
    </div>
  )
}
