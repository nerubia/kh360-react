import { AddSkillsHeader } from "@features/skill-map-forms/[id]/add/add-skills-header"
import { AddSkillsFilter } from "@features/skill-map-forms/[id]/add/add-skills-filter"
import { AddSkillsTable } from "@features/skill-map-forms/[id]/add/add-skills-table"
import { AddSkillsFooter } from "@features/skill-map-forms/[id]/add/add-skills-footer"
import { useTitle } from "@hooks/useTitle"

export default function AddSkills() {
  useTitle("Add Skills")

  return (
    <div className='xl:h-[calc(100vh_-_104px)] flex flex-col gap-8 w-full'>
      <AddSkillsHeader />
      <AddSkillsFilter />
      <AddSkillsTable />
      <AddSkillsFooter />
    </div>
  )
}
