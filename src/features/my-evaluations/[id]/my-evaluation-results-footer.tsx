import { useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/button/button"
import { Icon } from "../../../components/ui/icon/icon"

export const MyEvaluationResultsFooter = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(`/my-evaluations`)
  }

  return (
    <>
      <Button testId='BackButton' variant='primaryOutline' size='medium' onClick={handleGoBack}>
        <Icon icon='ChevronLeft' />
      </Button>
    </>
  )
}
