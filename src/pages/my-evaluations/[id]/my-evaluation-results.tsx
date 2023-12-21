import { MyEvaluationResultsHeader } from "../../../features/my-evaluations/[id]/my-evaluation-results-header"
import { MyEvaluationResultsTable } from "../../../features/my-evaluations/[id]/my-evaluation-results-table"
import { MyEvaluationResultsComments } from "../../../features/my-evaluations/[id]/my-evaluation-results-comments"
import { MyEvaluationResultsFooter } from "../../../features/my-evaluations/[id]/my-evaluation-results-footer"

export default function MyEvaluationResults() {
  return (
    <div className='flex flex-col gap-2'>
      <div className='h-[calc(100vh_-_104px)] flex flex-col gap-5'>
        <MyEvaluationResultsHeader />
        <MyEvaluationResultsTable />
        <MyEvaluationResultsComments />
        <MyEvaluationResultsFooter />
      </div>
    </div>
  )
}
