import { EvaluationResultsListFilter } from "@features/evaluation-results/evaluation-results-list-filter"
import { EvaluationResultsListHeader } from "@features/evaluation-results/evaluation-results-list-header"
import { EvaluationResultsListTable } from "@features/evaluation-results/evaluation-results-list-table"
import { useTitle } from "@hooks/useTitle"

export default function EvaluationResults() {
  useTitle("Evaluation Results")

  return (
    <div className='flex flex-col gap-8'>
      <EvaluationResultsListHeader />
      <EvaluationResultsListFilter />
      <EvaluationResultsListTable />
    </div>
  )
}
