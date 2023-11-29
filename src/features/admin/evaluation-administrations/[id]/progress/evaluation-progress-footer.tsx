import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../../../../components/ui/button/button"
import { Icon } from "../../../../../components/ui/icon/icon"

export const EvaluationProgressFooter = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const handleGoBack = () => {
    navigate(`/admin/evaluation-administrations/${id}`)
  }

  return (
    <>
      <Button testId='BackButton' variant='primaryOutline' size='medium' onClick={handleGoBack}>
        <Icon icon='ChevronLeft' />
      </Button>
    </>
  )
}
