import { useTitle } from "../../hooks/useTitle"
import { UserEvaluationAdministrationsHeader } from "../../features/evaluations/user-evaluation-administrations-header"
import { UserEvaluationAdministrationsTable } from "../../features/evaluations/user-evaluation-administrations-table"

export default function EvaluationAdministrations() {
  useTitle("Performance Evaluations")

  return (
    <div className='flex flex-col gap-8'>
      <UserEvaluationAdministrationsHeader />
      <UserEvaluationAdministrationsTable />
    </div>
  )
}
