import { SurveyResultsAction } from "@features/admin/survey-results/survey-results-action"
import { SurveyResultsHeader } from "@features/admin/survey-results/survey-results-header"
import { SurveyResultsTable } from "@features/admin/survey-results/survey-results-table"
import { SurveyResultsFilter } from "@features/admin/survey-results/survey-resutls-filter"
import { useTitle } from "@hooks/useTitle"

export default function SurveyResults() {
  useTitle("Survey Results")

  return (
    <div className='flex flex-col gap-8'>
      <SurveyResultsHeader />
      <SurveyResultsFilter />
      <SurveyResultsAction />
      <SurveyResultsTable />
    </div>
  )
}
