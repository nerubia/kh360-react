import { useNavigate } from "react-router-dom"
import { Button } from "../../../../components/ui/button/button"
import { Icon } from "../../../../components/ui/icon/icon"
import { useAppSelector } from "../../../../hooks/useAppSelector"

export const ViewEvaluationFooter = () => {
  const navigate = useNavigate()

  const { previousUrl } = useAppSelector((state) => state.app)

  const handleGoBack = () => {
    if (previousUrl !== null) {
      navigate(previousUrl)
      return
    }
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
