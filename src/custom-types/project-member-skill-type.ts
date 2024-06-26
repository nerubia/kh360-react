import { type Skill } from "@custom-types/skill-type"

export interface ProjectMemberSkill {
  id: number
  sequence_no: number
  skills: Skill
  start_date?: string
  end_date?: string
}
