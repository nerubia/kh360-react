import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../../../../components/ui/button/button"
import { Icon } from "../../../../../components/ui/icon/icon"
import { useMobileView } from "../../../../../hooks/use-mobile-view"
export const EvaluationProgressFooter = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isMobile = useMobileView()

  const size = isMobile ? "small" : "medium"

  const handleGoBack = () => {
    navigate(`/admin/evaluation-administrations/${id}`)
  }

  return (
    <>
      <Button testId='BackButton' variant='primaryOutline' size={size} onClick={handleGoBack}>
        <Icon icon='ChevronLeft' />
      </Button>
    </>
  )
}
