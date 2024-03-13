import { useTitle } from "@hooks/useTitle"
import { SkillsHeader } from "@features/admin/skills/skills-header"
import { SkillsFilter } from "@features/admin/skills/skills-filter"
import { SkillsAction } from "@features/admin/skills/skills-action"
import { SkillsTable } from "@features/admin/skills/skills-table"

export default function Skills() {
  useTitle("Skills")

  return (
    <div className='md:h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <SkillsHeader />
      <SkillsFilter />
      <SkillsAction />
      <SkillsTable />
    </div>
  )
}
