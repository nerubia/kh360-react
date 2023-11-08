import { EvalueesList } from "../../../../../features/admin/evaluation-administrations/[id]/evaluees/EvalueesList"
import { EvalueesFilter } from "../../../../../features/admin/evaluation-administrations/[id]/evaluees/EvalueesFilter"
import { EvalueesFooter } from "../../../../../features/admin/evaluation-administrations/[id]/evaluees/EvalueesFooter"
import { EvalueesHeader } from "../../../../../features/admin/evaluation-administrations/[id]/evaluees/EvalueesHeader"

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
