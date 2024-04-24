import { SkillMapFormHeader } from "@features/skill-map-forms/[id]/skill-map-form-header"
import { SkillMapFormAction } from "@features/skill-map-forms/[id]/skill-map-form-action"
import { SkillMapFormTable } from "@features/skill-map-forms/[id]/skill-map-form-table"
import { useTitle } from "@hooks/useTitle"

export default function SurveyForm() {
  useTitle("Skill Map Form")

  return (
    <div className='h-[calc(100vh_-_180px)] flex flex-col gap-8'>
      <SkillMapFormHeader />
      <SkillMapFormAction />
      <SkillMapFormTable />
    </div>
  )
}
