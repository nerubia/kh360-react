import { LinkButton } from "../../../components/button/Button"
import { Icon } from "../../../components/icon/Icon"
import { CreateEvaluationForm } from "../../../features/evaluations/create/CreateEvaluationForm"

export default function CreateEvaluation() {
  return (
    <div className='flex flex-col gap-4'>
      <LinkButton variant='unstyled' to='/evaluations'>
        <Icon icon='ChevronLeft' />
        Go back
      </LinkButton>
      <CreateEvaluationForm />
    </div>
  )
}
