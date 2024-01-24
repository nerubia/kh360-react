import { SelectProjectMemberSkillsHeader } from "../../../../../features/admin/project-assigments/project-assignment-form/select-project-member-skills/select-project-member-skills-header"
import { SelectProjectMemberSkillsFilter } from "../../../../../features/admin/project-assigments/project-assignment-form/select-project-member-skills/select-project-member-skills-filter"
import { SelectProjectMemberSkillsTable } from "../../../../../features/admin/project-assigments/project-assignment-form/select-project-member-skills/select-project-member-skills-table"
import { SelectProjectMemberSkillsFooter } from "../../../../../features/admin/project-assigments/project-assignment-form/select-project-member-skills/select-project-member-skills-footer"
import { useTitle } from "../../../../../hooks/useTitle"

export default function SelectSkills() {
  useTitle("Select Skills")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8 w-[50%] '>
      <SelectProjectMemberSkillsHeader />
      <SelectProjectMemberSkillsFilter />
      <SelectProjectMemberSkillsTable />
      <SelectProjectMemberSkillsFooter />
    </div>
  )
}
