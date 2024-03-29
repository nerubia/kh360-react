import { useTitle } from "@hooks/useTitle"
import { ProjectAssignmentsHeader } from "@features/admin/project-assigments/project-assignments-header"
import { ProjectAssignmentsFilter } from "@features/admin/project-assigments/project-assignments-filter"
import { ProjectAssignmentsAction } from "@features/admin/project-assigments/project-assignments-action"
import { ProjectAssignmentsList } from "@features/admin/project-assigments/project-assignments-list"

export default function ProjectAssignments() {
  useTitle("Project Assignments")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <ProjectAssignmentsHeader />
      <ProjectAssignmentsFilter />
      <ProjectAssignmentsAction />
      <ProjectAssignmentsList />
    </div>
  )
}
