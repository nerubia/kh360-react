import { ViewEvaluationResultsHeader } from "../../../features/evaluation-results/[id]/view-evaluation-results-header"
import { ViewEvaluationResultsTable } from "../../../features/evaluation-results/[id]/view-evaluation-results-table"
import { ViewEvaluationResultsComments } from "../../../features/evaluation-results/[id]/view-evaluation-results-comments"
import { ViewEvaluationResultsFooter } from "../../../features/evaluation-results/[id]/view-evaluation-results-footer"
import { ViewEvaluationResultsAttendanceAndPunctuality } from "../../../features/evaluation-results/[id]/view-evaluation-results-attendance-and-punctuality"

export default function ViewEvaluationResults() {
  return (
    <div className='flex flex-col gap-2'>
      <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
        <ViewEvaluationResultsHeader />
        <ViewEvaluationResultsTable />
        <ViewEvaluationResultsAttendanceAndPunctuality />
        <ViewEvaluationResultsComments />
        <ViewEvaluationResultsFooter />
      </div>
    </div>
  )
}
