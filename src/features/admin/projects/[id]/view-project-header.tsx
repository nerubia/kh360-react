import { useEffect, useState } from "react"
import { useAppSelector } from "@hooks/useAppSelector"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { PageTitle } from "@components/shared/page-title"
import { closeProject, getProject } from "@redux/slices/project-slice"
import { formatDateRange } from "@utils/format-date"
import { Badge } from "@components/ui/badge/badge"
import { getProjectStatusVariant } from "@utils/variant"
import { Button } from "@components/ui/button/button"
import { ProjectStatus } from "@custom-types/project-type"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { Loading } from "@custom-types/loadingType"
import { setAlert } from "@redux/slices/app-slice"

export const ViewProjectHeader = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, project } = useAppSelector((state) => state.project)

  const [showDialog, setShowDialog] = useState<boolean>(false)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getProject(parseInt(id)))
    }
  }, [])

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
      <div className='flex flex-col'>
        <div className='flex flex-col justify-between items-start md:items-end mt-2 md:flex-row gap-5'>
          <div className='flex-1'>
            <div className='flex gap-4 primary-outline items-end mb-4'>
              <div className='flex items-center gap-5'>
                <PageTitle>{project?.name}</PageTitle>
                <Badge variant={getProjectStatusVariant(project?.status)}>
                  <div className='uppercase'>{project?.status}</div>
                </Badge>
              </div>
            </div>
            <div className='flex gap-3 pt-1'>
              <div className='font-bold'>Client Name: </div>
              <div>{project?.client?.name}</div>
            </div>
            <div className='flex gap-3 pt-1'>
              <div className='font-bold'>Project Duration: </div>
              <div>{formatDateRange(project?.start_date, project?.end_date)}</div>
            </div>
            <div className='flex gap-3 pt-1'>
              <div className='font-bold'>Description: </div>
              <div>{project?.description}</div>
            </div>
          </div>
          {project?.status !== ProjectStatus.Closed && (
            <Button variant='primary' onClick={() => setShowDialog(true)}>
              Close Project
            </Button>
          )}
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
