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
      <h1 className='text-lg font-bold'>Create Evaluation</h1>
      <CreateEvaluationForm />
    </div>
  )
}
