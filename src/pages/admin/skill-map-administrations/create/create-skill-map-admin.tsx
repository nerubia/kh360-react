import { useTitle } from "@hooks/useTitle"
import { CreateSkillMapAdminHeader } from "@features/admin/skill-map-administrations/create/create-skill-map-admin-header"
import { SkillMapAdminForm } from "@features/admin/skill-map-administrations/create/skill-map-admin-form"

export default function CreateSkillMapAdmin() {
  useTitle("Create Skill Map Admin")

  return (
    <div className='flex flex-col gap-5'>
      <CreateSkillMapAdminHeader />
      <SkillMapAdminForm />
    </div>
  )
}
