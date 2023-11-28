import { useTitle } from "../../../hooks/useTitle"
import { EvaluationAdministrationsFilter } from "../../../features/admin/evaluation-administrations/evaluation-administrations-filter"
import { EvaluationAdministrationsHeader } from "../../../features/admin/evaluation-administrations/evaluation-administrations-header"
import { EvaluationAdministrationsTable } from "../../../features/admin/evaluation-administrations/evaluation-administrations-table"
import { EvaluationAdministrationsAction } from "../../../features/admin/evaluation-administrations/evaluation-administrations-action"

export default function EvaluationAdministrations() {
  useTitle("Admin Evaluations")

  return (
    <div className='flex flex-col gap-8'>
      <EvaluationAdministrationsHeader />
      <EvaluationAdministrationsFilter />
      <EvaluationAdministrationsAction />
      <EvaluationAdministrationsTable />
    </div>
  )
}
