import { UploadSkillMapAdminForm } from "@features/admin/skill-map-administrations/upload/upload-skill-map-admin-form"
import { UploadSkillMapAdminHeader } from "@features/admin/skill-map-administrations/upload/upload-skill-map-admin-header"
import { useTitle } from "@hooks/useTitle"

export default function UploadSkillMapAdmin() {
  useTitle("Upload Skill Map Admin")

  return (
    <div className='flex flex-col gap-5'>
      <UploadSkillMapAdminHeader />
      <UploadSkillMapAdminForm />
    </div>
  )
}
