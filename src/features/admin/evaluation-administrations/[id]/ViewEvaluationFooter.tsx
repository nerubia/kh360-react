import { useNavigate } from "react-router-dom"
import { Button } from "../../../../components/ui/button/button"
import { Icon } from "../../../../components/icon/Icon"

export const ViewEvaluationFooter = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(`/admin/evaluation-administrations`)
  }

  return (
    <>
      <Button testId='BackButton' variant='primaryOutline' size='medium' onClick={handleGoBack}>
        <Icon icon='ChevronLeft' />
      </Button>
    </>
  )
}
