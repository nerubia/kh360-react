import { Divider } from "../../../../../../../components/ui/divider/divider"
import { EvaluatorsRoles } from "../../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/evaluators-roles"
import { EvaluatorsList } from "../../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/evaluators-list"
import { EvaluatorsUser } from "../../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/evaluators-user"
import { useTitle } from "../../../../../../../hooks/useTitle"

export default function Evaluators() {
  useTitle("Evaluators")

  return (
    <div className='flex flex-col'>
      <EvaluatorsUser />
      <Divider />
      <div className='flex gap-4'>
        <EvaluatorsRoles />
        <Divider orientation='vertical' />
        <EvaluatorsList />
      </div>
    </div>
  )
}
