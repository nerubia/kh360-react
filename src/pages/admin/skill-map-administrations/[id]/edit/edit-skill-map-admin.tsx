import { useTitle } from "@hooks/useTitle"
import { EditSkillMapAdminHeader } from "@features/admin/skill-map-administrations/[id]/edit/edit-skill-map-admin-header"
import { SkillMapAdminForm } from "@features/admin/skill-map-administrations/create/skill-map-admin-form"

export default function EditSkillMapAdmin() {
  useTitle("Edit Skill Map Administration")

  return (
    <div className='flex flex-col gap-5'>
      <EditSkillMapAdminHeader />
      <SkillMapAdminForm />
    </div>
  )
}
