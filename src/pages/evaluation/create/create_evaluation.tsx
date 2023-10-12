import { LinkButton } from "../../../components/button/Button"
import { Icon } from "../../../components/icon/Icon"
import { CreateEvaluationForm } from "../../../features/evaluation/create/CreateEvaluationForm"

export default function CreateEvaluation() {
  return (
    <div className='flex flex-col gap-4'>
      <LinkButton variant='unstyled' to='/evaluation'>
        <Icon icon='ChevronLeft' />
        Go back
      </LinkButton>
      <CreateEvaluationForm />
    </div>
  )
}
