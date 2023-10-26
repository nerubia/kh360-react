import { Divider } from "../../../../../../components/divider/Divider"
import { EvaluatorsRoles } from "../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[employee_slug]/evaluators/EvaluatorsRoles"
import { EvaluatorsList } from "../../../../../../features/admin/evaluation-administrations/[id]/evaluees/[employee_slug]/evaluators/EvaluatorsList"

export default function Evaluators() {
  return (
    <div className='flex gap-4'>
      <EvaluatorsRoles />
      <Divider orientation='vertical' />
      <EvaluatorsList />
    </div>
  )
}
