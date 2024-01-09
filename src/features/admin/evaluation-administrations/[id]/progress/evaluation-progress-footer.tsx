import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../../../../components/ui/button/button"
import { Icon } from "../../../../../components/ui/icon/icon"
import { useMobileView } from "../../../../../hooks/use-mobile-view"
export const EvaluationProgressFooter = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isMobile = useMobileView()
  const handleGoBack = () => {
    navigate(`/admin/evaluation-administrations/${id}`)
  }

  return (
    <>
      <Button
        testId='BackButton'
        variant='primaryOutline'
        size={isMobile ? "small" : "medium"}
        onClick={handleGoBack}
      >
        <Icon icon='ChevronLeft' />
      </Button>
    </>
  )
}
