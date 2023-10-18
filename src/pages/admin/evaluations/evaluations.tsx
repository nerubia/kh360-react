import { EvaluationsFilter } from "../../../features/admin/evaluations/EvaluationsFilter"
import { EvaluationsHeader } from "../../../features/admin/evaluations/EvaluationsHeader"
import { EvaluationsTable } from "../../../features/admin/evaluations/EvaluationsTable"

export default function Evaluations() {
  return (
    <div className='flex flex-col gap-8'>
      <EvaluationsFilter />
      <EvaluationsHeader />
      <EvaluationsTable />
    </div>
  )
}
