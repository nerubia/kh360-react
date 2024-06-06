import { useNavigate, useParams } from "react-router-dom"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { useAppSelector } from "@hooks/useAppSelector"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { useState } from "react"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { Loading } from "@custom-types/loadingType"
import { closeProject } from "@redux/slices/project-slice"
import { setAlert } from "@redux/slices/app-slice"
import { ProjectStatus } from "@custom-types/project-type"

export const ViewProjectFooter = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { previousUrl } = useAppSelector((state) => state.app)

  const { loading, project } = useAppSelector((state) => state.project)

  const [showDialog, setShowDialog] = useState<boolean>(false)

  const handleGoBack = () => {
    if (previousUrl !== null) {
      navigate(previousUrl)
      return
    }
    navigate(`/admin/projects`)
  }

  const onSubmit = async () => {
    if (id !== undefined) {
      try {
        const result = await appDispatch(closeProject(Number(id)))
        setShowDialog(false)
        if (result.type === "project/closeProject/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "project/closeProject/fulfilled") {
          appDispatch(
            setAlert({
              description: "Project closed successfully",
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  return (
    <>
      <div className='pb-5 flex flex-col gap-3'>
        {project?.status !== ProjectStatus.Closed && (
          <Button variant='primary' onClick={() => setShowDialog(true)}>
            Close Project
          </Button>
        )}
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
      <CustomDialog
        open={showDialog}
        title='Close Project'
        description='Are you sure you want to close this project?'
        onClose={() => setShowDialog(false)}
        onSubmit={onSubmit}
        loading={loading === Loading.Pending}
      />
    </>
  )
}
