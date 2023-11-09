import { Divider } from "../../../../../../../components/divider/Divider"
import { EvaluatorsRoles } from "../../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/EvaluatorsRoles"
import { EvaluatorsList } from "../../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/EvaluatorsList"
import { EvaluatorsUser } from "../../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/EvaluatorsUser"

export default function Evaluators() {
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
