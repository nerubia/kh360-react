import { useTitle } from "@hooks/useTitle"
import { SkillCategoriesHeader } from "@features/admin/skill-categories/skill-categories-header"
import { SkillCategoriesFilter } from "@features/admin/skill-categories/skill-categories-filter"
import { SkillCategoriesAction } from "@features/admin/skill-categories/skill-categories-action"
import { SkillCategoriesTable } from "@features/admin/skill-categories/skill-categories-table"

export default function SkillCategories() {
  useTitle("Skill Categories")

  return (
    <div className='md:h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <SkillCategoriesHeader />
      <SkillCategoriesFilter />
      <SkillCategoriesAction />
      <SkillCategoriesTable />
    </div>
  )
}
