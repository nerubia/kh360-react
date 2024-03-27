import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { useMobileView } from "@hooks/use-mobile-view"

export const ViewSurveyResultsFooter = () => {
  const navigate = useNavigate()
  const isMobile = useMobileView()
  const { id } = useParams()

  const handleGoBack = () => {
    navigate(`/admin/survey-administrations/${id}`)
  }

  return (
    <div className='pb-5'>
      <Button
        testId='BackButton'
        variant='primaryOutline'
        size={isMobile ? "small" : "medium"}
        onClick={handleGoBack}
      >
        <Icon icon='ChevronLeft' />
      </Button>
    </div>
  )
}
