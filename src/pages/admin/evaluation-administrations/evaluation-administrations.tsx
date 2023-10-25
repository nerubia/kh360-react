import { useTitle } from "../../../hooks/useTitle"
import { EvaluationAdministrationsFilter } from "../../../features/admin/evaluation-administrations/EvaluationAdministrationsFilter"
import { EvaluationAdministrationsHeader } from "../../../features/admin/evaluation-administrations/EvaluationAdministrationsHeader"
import { EvaluationAdministrationsTable } from "../../../features/admin/evaluation-administrations/EvaluationAdministrationsTable"

export default function EvaluationAdministrations() {
  useTitle("Admin Evaluations")

  return (
    <div className='flex flex-col gap-8'>
      <EvaluationAdministrationsFilter />
      <EvaluationAdministrationsHeader />
      <EvaluationAdministrationsTable />
    </div>
  )
}
