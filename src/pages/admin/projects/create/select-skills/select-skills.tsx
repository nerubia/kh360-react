import { SelectSkillsHeader } from "../../../../../features/admin/projects/create/select-skills/select-skills-header"
import { SelectSkillsFilter } from "../../../../../features/admin/projects/create/select-skills/select-skills-filter"
import { SelectSkillsTable } from "../../../../../features/admin/projects/create/select-skills/select-skills-table"
import { SelectSkillsFooter } from "../../../../../features/admin/projects/create/select-skills/select-skills-footer"
import { useTitle } from "../../../../../hooks/useTitle"

export default function SelectSkills() {
  useTitle("Select Skills")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8 w-[50%] '>
      <SelectSkillsHeader />
      <SelectSkillsFilter />
      <SelectSkillsTable />
      <SelectSkillsFooter />
    </div>
  )
}
