import { ViewSurveyResultsHeader } from "@features/admin/survey-results/[id]/view-survey-results-header"
import { ViewSurveyResultsTable } from "@features/admin/survey-results/[id]/view-survey-results.table"
import { ViewSurveyResultsFooter } from "@features/admin/survey-results/[id]/view-survey-results-footer"

export default function ViewSurveyResults() {
  return (
    <div className='flex flex-col gap-2'>
      <div className='h-[calc(100vh_-_104px)] flex flex-col gap-12'>
        <ViewSurveyResultsHeader />
        <ViewSurveyResultsTable />
        <ViewSurveyResultsFooter />
      </div>
    </div>
  )
}
