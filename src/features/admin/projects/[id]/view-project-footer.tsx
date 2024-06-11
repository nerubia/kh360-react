import { useNavigate, useParams } from "react-router-dom"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { useAppSelector } from "@hooks/useAppSelector"

export const ViewProjectFooter = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { previousUrl } = useAppSelector((state) => state.app)

  const handleGoBack = () => {
    if (previousUrl !== null) {
      navigate(previousUrl)
      return
    }
    navigate(`/admin/projects`)
  }

  return (
    <>
      <div className='pb-5 flex flex-col gap-3'>
        <div className='flex gap-3'>
          <Button testId='BackButton' variant='primaryOutline' size='medium' onClick={handleGoBack}>
            <Icon icon='ChevronLeft' />
          </Button>
          <LinkButton
            testId='EditButton'
            variant='primaryOutline'
            size='medium'
            to={`/admin/projects/${id}/edit?callback=/admin/projects/${id}`}
          >
            <Icon icon='PenSquare' />
          </LinkButton>
        </div>
      </div>
    </>
  )
}
