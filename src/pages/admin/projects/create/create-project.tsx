import { CreateProjectHeader } from "../../../../features/admin/projects/create/create-project-header"
import { CreateProjectForm } from "../../../../features/admin/projects/create/create-project-form"
import { useTitle } from "../../../../hooks/useTitle"

export default function CreateProject() {
  useTitle("Create Project")

  return (
    <div className='flex flex-col gap-8'>
      <CreateProjectHeader />
      <CreateProjectForm />
    </div>
  )
}
