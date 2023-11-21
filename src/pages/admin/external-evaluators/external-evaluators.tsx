import { useTitle } from "../../../hooks/useTitle"
import { ExternalEvaluatorsHeader } from "../../../features/admin/external-evaluators/ExternalEvaluatorsHeader"
import { ExternalEvaluatorsFilter } from "../../../features/admin/external-evaluators/ExternalEvaluatorsFilter"
import { ExternalEvaluatorsTable } from "../../../features/admin/external-evaluators/ExternalEvaluatorsTable"
import { ExternalEvaluatorsAction } from "../../../features/admin/external-evaluators/ExternalEvaluatorsAction"

export default function ExternalEvaluators() {
  useTitle("External Evaluators")

  return (
    <div className='flex flex-col gap-8'>
      <ExternalEvaluatorsHeader />
      <ExternalEvaluatorsFilter />
      <ExternalEvaluatorsAction />
      <ExternalEvaluatorsTable />
    </div>
  )
}
