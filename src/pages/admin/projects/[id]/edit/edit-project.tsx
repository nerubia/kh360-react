import { useTitle } from "@hooks/useTitle"
import { EditProjectHeader } from "@features/admin/projects/[id]/edit/edit-project-header"
import { CreateProjectForm } from "@features/admin/projects/create/create-project-form"

export default function EditProjects() {
  useTitle("Edit Project")

  return (
    <div className='flex flex-col gap-8'>
      <EditProjectHeader />
      <CreateProjectForm />
    </div>
  )
}
