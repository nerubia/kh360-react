import { useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/button/button"
import { Icon } from "../../../components/ui/icon/icon"

export const ViewEvaluationResultsFooter = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(`/my-evaluations`)
  }

  return (
    <div className='pb-5'>
      <Button testId='BackButton' variant='primaryOutline' size='medium' onClick={handleGoBack}>
        <Icon icon='ChevronLeft' />
      </Button>
    </div>
  )
}
