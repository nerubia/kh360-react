import { SkillMapSearchAction } from "@features/admin/skill-map-search/skill-map-search-actions"
import { SkillMapSearchFilter } from "@features/admin/skill-map-search/skill-map-search-filter"
import { SkillMapSearchHeader } from "@features/admin/skill-map-search/skill-map-search-header"
import { SkillMapSearchTable } from "@features/admin/skill-map-search/skill-map-search-table"
import { useTitle } from "@hooks/useTitle"

export default function SkillMapSearch() {
  useTitle("Skill Map Search")

  return (
    <div className='flex flex-col gap-8'>
      <SkillMapSearchHeader />
      <SkillMapSearchFilter />
      <SkillMapSearchAction />
      <SkillMapSearchTable />
    </div>
  )
}
