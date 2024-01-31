import { useNavigate } from "react-router-dom"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { useMobileView } from "@hooks/use-mobile-view"

export const MyEvaluationResultsFooter = () => {
  const navigate = useNavigate()
  const isMobile = useMobileView()

  const size = isMobile ? "small" : "medium"

  const handleGoBack = () => {
    navigate(`/my-evaluations`)
  }

  return (
    <div className='pb-5'>
      <Button testId='BackButton' variant='primaryOutline' size={size} onClick={handleGoBack}>
        <Icon icon='ChevronLeft' />
      </Button>
    </div>
  )
}
