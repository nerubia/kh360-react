import { useSearchParams, useNavigate } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useEffect, useState, lazy, Suspense } from "react"
import { deleteProject, getProjects } from "@redux/slices/projects-slice"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { Pagination } from "@components/shared/pagination/pagination"
import { setAlert, setPreviousUrl } from "@redux/slices/app-slice"
import { useFullPath } from "@hooks/use-full-path"
import { setCheckedSkills, setSelectedSkills } from "@redux/slices/skills-slice"
import { Badge } from "@components/ui/badge/badge"
import { getProjectStatusVariant } from "@utils/variant"
import { projectsColumns, type Project } from "@custom-types/project-type"
import { Table } from "@components/ui/table/table"

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

  const ProjectsDialog = lazy(async () => await import("@features/admin/projects/projects-dialog"))

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

  const renderCell = (item: Project, column: unknown) => {
    let truncatedName: string | undefined
    switch (column) {
      case "Name":
        truncatedName =
          item.name != null && item.name.length > 50 ? `${item.name.slice(0, 50)}...` : item.name
        return <div>{truncatedName}</div>
      case "Client":
        return `${item.client?.name ?? "-"}`
      case "Status":
        return (
          <Badge variant={getProjectStatusVariant(item.status)} size='small'>
            {item.status?.toUpperCase()}
          </Badge>
        )
      case "Actions":
        return (
          <div className='flex gap-2 justify-center'>
            <LinkButton
              testId='ViewButton'
              variant='unstyled'
              to={`/admin/projects/${item.id}`}
              onClick={() => {
                handleViewProject(item.id)
              }}
            >
              <Icon icon='Eye' size='extraSmall' color='gray' />
            </LinkButton>
            <Button testId='DeleteButton' variant='unstyled' onClick={() => toggleDialog(item.id)}>
              <Icon icon='Trash' size='extraSmall' color='gray' />
            </Button>
          </div>
        )
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      <Table data={projects} columns={projectsColumns} renderCell={renderCell} />
      <Suspense>
        <ProjectsDialog
          open={showDialog}
          title='Delete Project'
          description={
            <>
              Are you sure you want to delete this project? <br />
              This will delete all records associated with this project and cannot be reverted.
            </>
          }
          onClose={() => toggleDialog(null)}
          onSubmit={async () => {
            await handleDelete()
            toggleDialog(null)
          }}
        />
      </Suspense>
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
