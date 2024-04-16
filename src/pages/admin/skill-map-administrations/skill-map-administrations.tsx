import { useTitle } from "@hooks/useTitle"
import { SkillMapAdministrationsHeader } from "@features/admin/skill-map-administrations/skill-map-administrations-header"
import { SkillMapAdministrationsFilter } from "@features/admin/skill-map-administrations/skill-map-administrations-filter"
import { SkillMapAdministrationsAction } from "@features/admin/skill-map-administrations/skill-map-administrations-action"
import { SkillMapAdministrationsTable } from "@features/admin/skill-map-administrations/skill-map-administrations-table"

export default function SkillMapAdministrations() {
  useTitle("Skill Map Admininistrations")

  return (
    <div className='flex flex-col gap-8'>
      <SkillMapAdministrationsHeader />
      <SkillMapAdministrationsFilter />
      <SkillMapAdministrationsAction />
      <SkillMapAdministrationsTable />
    </div>
  )
}
