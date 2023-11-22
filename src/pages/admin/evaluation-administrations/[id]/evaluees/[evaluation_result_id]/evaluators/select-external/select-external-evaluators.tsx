import { useTitle } from "../../../../../../../../hooks/useTitle"
import { SelectExternalEvaluatorsHeader } from "../../../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/select-external/select-external-evaluators-header"
import { SelectExternalEvaluatorsFilter } from "../../../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/select-external/select-external-evaluators-filter"
import { SelectExternalEvaluatorsTable } from "../../../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/select-external/select-external-evaluators-table"
import { SelectExternalEvaluatorsFooter } from "../../../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/select-external/select-external-evaluators-footer"

export default function SelectExternalEvaluators() {
  useTitle("External Evaluators List")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <SelectExternalEvaluatorsHeader />
      <SelectExternalEvaluatorsFilter />
      <SelectExternalEvaluatorsTable />
      <SelectExternalEvaluatorsFooter />
    </div>
  )
}
