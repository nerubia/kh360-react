import { useTitle } from "../../hooks/useTitle"
import { UserEvaluationAdministrationsHeader } from "../../features/evaluations/UserEvaluationAdministrationsHeader"
import { UserEvaluationAdministrationsTable } from "../../features/evaluations/UserEvaluationAdministrationsTable"

export default function EvaluationAdministrations() {
  useTitle("Admin Evaluations")

  return (
    <div className='flex flex-col gap-8'>
      <UserEvaluationAdministrationsHeader />
      <UserEvaluationAdministrationsTable />
    </div>
  )
}
