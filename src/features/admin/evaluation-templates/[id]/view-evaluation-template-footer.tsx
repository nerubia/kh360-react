import { useNavigate, useParams } from "react-router-dom"
import { Button, LinkButton } from "../../../../components/ui/button/button"
import { Icon } from "../../../../components/ui/icon/icon"
import { useAppSelector } from "../../../../hooks/useAppSelector"

export const ViewEvaluationTemplateFooter = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { previousUrl } = useAppSelector((state) => state.app)

  const handleGoBack = () => {
    if (previousUrl !== null) {
      navigate(previousUrl)
      return
    }
    navigate(`/admin/evaluation-templates`)
  }

  return (
    <div className='pb-5 flex gap-3'>
      <Button testId='BackButton' variant='primaryOutline' size='medium' onClick={handleGoBack}>
        <Icon icon='ChevronLeft' />
      </Button>
      <LinkButton
        testId='EditButon'
        variant='primaryOutline'
        size='medium'
        to={`/admin/evaluation-templates/${id}/edit`}
      >
        <Icon icon='PenSquare' />
      </LinkButton>
    </div>
  )
}
