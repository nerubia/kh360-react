import { EvaluationResultsFilter } from "../../features/evaluation-results/evaluation-results-filter"
import { EvaluationResultsHeader } from "../../features/evaluation-results/evaluation-results-header"
import { EvaluationResultsTable } from "../../features/evaluation-results/evaluation-results-table"
import { useTitle } from "../../hooks/useTitle"

export default function EvaluationResults() {
  useTitle("Evaluation Results")

  return (
    <div className='flex flex-col gap-8'>
      <EvaluationResultsHeader />
      <EvaluationResultsFilter />
      <EvaluationResultsTable />
    </div>
  )
}
