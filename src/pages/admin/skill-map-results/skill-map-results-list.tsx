import { SkillMapResultsListHeader } from "@features/admin/skill-map-results/skill-map-results-list-header"
import { SkillMapResultsListFilter } from "@features/admin/skill-map-results/skill-map-results-list-filter"
import { SkillMapResultsListTable } from "@features/admin/skill-map-results/skill-map-results-list-table"
import { useTitle } from "@hooks/useTitle"

export default function SkillMapResults() {
  useTitle("Skill Map Results")

  return (
    <div className='flex flex-col gap-8'>
      <SkillMapResultsListHeader />
      <SkillMapResultsListFilter />
      <SkillMapResultsListTable />
    </div>
  )
}
