import { useNavigate } from "react-router-dom"
import { Button } from "../../../../components/ui/button/button"
import { Icon } from "../../../../components/ui/icon/icon"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useMobileView } from "../../../../hooks/use-mobile-view"
export const ViewEvaluationFooter = () => {
  const navigate = useNavigate()
  const isMobile = useMobileView()
  const { previousUrl } = useAppSelector((state) => state.app)

  const size = isMobile ? "small" : "medium"

  const handleGoBack = () => {
    if (previousUrl !== null) {
      navigate(previousUrl)
      return
    }
    navigate(`/admin/evaluation-administrations`)
  }

  return (
    <>
      <Button testId='BackButton' variant='primaryOutline' size={size} onClick={handleGoBack}>
        <Icon icon='ChevronLeft' />
      </Button>
    </>
  )
}
