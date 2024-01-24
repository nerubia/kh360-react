import { useSearchParams, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useEffect, useState } from "react"
import { deleteProject, getProjects } from "../../../redux/slices/projects-slice"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Button, LinkButton } from "../../../components/ui/button/button"
import { Icon } from "../../../components/ui/icon/icon"
import Dialog from "../../../components/ui/dialog/dialog"
import { Pagination } from "../../../components/shared/pagination/pagination"
import { setAlert, setPreviousUrl } from "../../../redux/slices/app-slice"
import { useFullPath } from "../../../hooks/use-full-path"
import { setCheckedSkills, setSelectedSkills } from "../../../redux/slices/skills-slice"

export const ProjectsTable = () => {
  const [searchParams] = useSearchParams()
  const fullPath = useFullPath()
  const navigate = useNavigate()

  const appDispatch = useAppDispatch()

  const { projects, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.projects
  )

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number>()

  useEffect(() => {
    void appDispatch(
      getProjects({
        name: searchParams.get("name") ?? undefined,
        client: searchParams.get("client") ?? undefined,
        skills: searchParams.get("skills") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
    void appDispatch(setSelectedSkills([]))
    void appDispatch(setCheckedSkills([]))
  }, [searchParams])

  const toggleDialog = (id: number | null) => {
    if (id !== null) {
      setSelectedProjectId(id)
    }
    setShowDialog((prev) => !prev)
  }

  const handleDelete = async () => {
    if (selectedProjectId !== undefined) {
      try {
        const result = await appDispatch(deleteProject(selectedProjectId))
        if (result.type === "project/deleteProject/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "project/deleteProject/fulfilled") {
          appDispatch(
            setAlert({
              description: "Project deleted successfully",
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  const handleViewProject = (id: number) => {
    appDispatch(setPreviousUrl(fullPath))
    navigate(`${id}`)
  }

  return (
    <div className='flex flex-col gap-8'>
      <table className='w-full'>
        <thead className='text-left'>
          <tr>
            <th className='pb-3 w-1/3'>Name</th>
            <th className='pb-3 w-1/3'>Client</th>
            <th className='pb-3 w-1/6'>Status</th>
            <th className='pb-3'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className='hover:bg-slate-100'>
              <td className='py-1'>{project.name}</td>
              <td className='py-1'>{project.client?.name}</td>
              <td className='py-1 w-1/6'>{project.status}</td>
              <td className='py-1 flex gap-2'>
                <LinkButton
                  testId='ViewButton'
                  variant='unstyled'
                  to={`/admin/projects/${project.id}`}
                  onClick={() => {
                    handleViewProject(project.id)
                  }}
                >
                  <Icon icon='Eye' />
                </LinkButton>
                <Button
                  testId='DeleteButton'
                  variant='unstyled'
                  onClick={() => toggleDialog(project.id)}
                >
                  <Icon icon='Trash' />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={showDialog}>
        <Dialog.Title>Delete Project</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this project? <br />
          This will delete all records associated with this project and cannot be reverted.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={() => toggleDialog(null)}>
            No
          </Button>
          <Button
            variant='primary'
            onClick={async () => {
              await handleDelete()
              toggleDialog(null)
            }}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
      {totalPages !== 1 && (
        <div className='flex justify-center'>
          <Pagination
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  )
}
