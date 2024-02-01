import { ProjectAssignmentForm } from "@features/admin/project-assigments/project-assignment-form/project-assignment-form"
import { ProjectAssignmentHeader } from "@features/admin/project-assigments/project-assignment-form/project-assignment-header"
import { useTitle } from "@hooks/useTitle"

export default function CreateProjectAssignment() {
  useTitle("Create Project Assignment")

  return (
    <div className='flex flex-col gap-5'>
      <ProjectAssignmentHeader />
      <ProjectAssignmentForm />
    </div>
  )
}
