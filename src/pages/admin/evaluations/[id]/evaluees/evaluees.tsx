import { EvalueesList } from "../../../../../features/admin/evaluations/[id]/evaluees/EvalueesList"
import { EvalueesFilter } from "../../../../../features/admin/evaluations/[id]/evaluees/EvalueesFilter"
import { EvalueesFooter } from "../../../../../features/admin/evaluations/[id]/evaluees/EvalueesFooter"
import { EvalueesHeader } from "../../../../../features/admin/evaluations/[id]/evaluees/EvalueesHeader"

export default function Evaluees() {
  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <EvalueesFilter />
      <EvalueesHeader />
      <EvalueesList />
      <EvalueesFooter />
    </div>
  )
}
