import { ProjectsAction } from "../../../features/admin/projects/projects-action"
import { ProjectsFilter } from "../../../features/admin/projects/projects-filter"
import { ProjectsHeader } from "../../../features/admin/projects/projects-header"
import { ProjectsTable } from "../../../features/admin/projects/projects-table"
import { useTitle } from "../../../hooks/useTitle"

export default function Projects() {
  useTitle("Projects")

  return (
    <div className='flex flex-col gap-8'>
      <ProjectsHeader />
      <ProjectsFilter />
      <ProjectsAction />
      <ProjectsTable />
    </div>
  )
}
