import { SkillMapResultFooter } from "@features/admin/skill-map-administrations/[id]/results/skill-map-footer"
import { SkillMapResultList } from "@features/admin/skill-map-administrations/[id]/results/skill-map-results-list"
import { SkillMapResultHeader } from "@features/admin/skill-map-administrations/[id]/results/skill-map-results.header"
import { useTitle } from "@hooks/useTitle"

export default function SkillMapAdminResults() {
  useTitle("Skill Map Admin - Results")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <SkillMapResultHeader />
      <SkillMapResultList />
      <SkillMapResultFooter />
    </div>
  )
}
