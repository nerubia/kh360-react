import { EditProjectAssignmentHeader } from "@features/admin/project-assigments/[id]/edit/edit-project-assignment-header"
import { ProjectAssignmentForm } from "@features/admin/project-assigments/project-assignment-form/project-assignment-form"
import { useTitle } from "@hooks/useTitle"

export default function EditProjectAssignment() {
  useTitle("Edit Project Assignment")

  return (
    <div className='flex flex-col gap-5'>
      <EditProjectAssignmentHeader />
      <ProjectAssignmentForm />
    </div>
  )
}
