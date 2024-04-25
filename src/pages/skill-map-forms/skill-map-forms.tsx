import { SkillMapFormsHeader } from "@features/skill-map-forms/skill-map-forms-header"
import { SkillMapFormsList } from "@features/skill-map-forms/skill-map-forms-list"
import { useTitle } from "@hooks/useTitle"

export default function SkillMapForms() {
  useTitle("Skill Map Forms")

  return (
    <div className='flex flex-col gap-8'>
      <SkillMapFormsHeader />
      <SkillMapFormsList />
    </div>
  )
}
