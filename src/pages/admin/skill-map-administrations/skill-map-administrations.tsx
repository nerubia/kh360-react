import { SkillMapAdministrationsHeader } from "@features/admin/skill-map-administrations/skill-map-administrations-header"
import { SkillMapAdministrationsFilter } from "@features/admin/skill-map-administrations/skill-map-administrations-filter"
import { SkillMapAdministrationsAction } from "@features/admin/skill-map-administrations/skill-map-administrations-action"
import { SkillMapAdministrationsTable } from "@features/admin/skill-map-administrations/skill-map-administrations-table"
import SelectUser from "@components/shared/select-user/select-user"

export default function SkillMapAdministrations() {
  return (
    <SelectUser
      HeaderComponent={SkillMapAdministrationsHeader}
      FilterComponent={SkillMapAdministrationsFilter}
      ActionComponent={SkillMapAdministrationsAction}
      TableComponent={SkillMapAdministrationsTable}
      title='Skill Map Admininistrations'
      className='flex flex-col gap-8'
    />
  )
}
