import { useParams } from "react-router-dom"
import { Button, LinkButton } from "../../../../../components/button/Button"
import { Icon } from "../../../../../components/icon/Icon"

export const EvalueesFooter = () => {
  const { id } = useParams()

  return (
    <div className='flex justify-between'>
      <Button variant='primaryOutline'>Cancel & Exit</Button>
      <div className='flex items-center gap-2'>
        <LinkButton
          testId='BackButton'
          variant='primaryOutline'
          to={`/admin/evaluations/${id}/select`}
        >
          <Icon icon='ChevronLeft' />
        </LinkButton>
        <Button variant='primaryOutline' disabled>
          Generate Evaluations
        </Button>
      </div>
    </div>
  )
}
