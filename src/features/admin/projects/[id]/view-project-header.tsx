import { useEffect } from "react"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { PageTitle } from "../../../../components/shared/page-title"
import { getProject } from "../../../../redux/slices/project-slice"
import { formatDateRange } from "../../../../utils/format-date"

export const ViewProjectHeader = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { project } = useAppSelector((state) => state.project)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getProject(parseInt(id)))
    }
  }, [])

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col justify-between items-start md:items-end mt-2 md:flex-row gap-5'>
          <div>
            <div className='flex gap-4 primary-outline items-end mb-4'>
              <PageTitle>{project?.name}</PageTitle>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Client Name: </div>
              <div>{project?.client?.name}</div>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Project Duration: </div>
              <div>{formatDateRange(project?.start_date, project?.end_date)}</div>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Status: </div>
              <div>{project?.status}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
