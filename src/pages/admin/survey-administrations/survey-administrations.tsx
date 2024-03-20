import { useTitle } from "@hooks/useTitle"
import { SurveyAdministrationsHeader } from "@features/admin/survey-administrations/survey-administrations-header"
import { SurveyAdministrationsFilter } from "@features/admin/survey-administrations/survey-administrations-filter"
import { SurveyAdministrationsAction } from "@features/admin/survey-administrations/survey-administrations-action"
import { SurveyAdministrationsTable } from "@features/admin/survey-administrations/survey-administrations-table"

export default function SurveyAdministrations() {
  useTitle("Survey Admininistrations")

  return (
    <div className='flex flex-col gap-8'>
      <SurveyAdministrationsHeader />
      <SurveyAdministrationsFilter />
      <SurveyAdministrationsAction />
      <SurveyAdministrationsTable />
    </div>
  )
}
