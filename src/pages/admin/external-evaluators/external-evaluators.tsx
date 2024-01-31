import { useTitle } from "@hooks/useTitle"
import { ExternalEvaluatorsHeader } from "@features/admin/external-evaluators/external-evaluators-header"
import { ExternalEvaluatorsFilter } from "@features/admin/external-evaluators/external-evaluators-filter"
import { ExternalEvaluatorsTable } from "@features/admin/external-evaluators/external-evaluators-table"
import { ExternalEvaluatorsAction } from "@features/admin/external-evaluators/external-evaluators-action"

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
