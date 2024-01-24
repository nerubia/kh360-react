import { ViewProjectHeader } from "../../../../features/admin/projects/[id]/view-project-header"
import { ViewProjectTable } from "../../../../features/admin/projects/[id]/view-project-table"
import { ViewProjectMembersList } from "../../../../features/admin/projects/[id]/view-project-members-list"
import { ViewProjectFooter } from "../../../../features/admin/projects/[id]/view-project-footer"
import { useTitle } from "../../../../hooks/useTitle"

export default function ViewProject() {
  useTitle("View Evaluation Templates")
  return (
    <div className='flex flex-col gap-10'>
      <ViewProjectHeader />
      <ViewProjectTable />
      <ViewProjectMembersList />
      <ViewProjectFooter />
    </div>
  )
}
