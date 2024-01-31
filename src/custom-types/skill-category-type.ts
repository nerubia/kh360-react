import { type Skill } from "@custom-types/skill-type"

export interface SkillCategory {
  id: number
  name?: string
  sequence_no?: number
  description?: string
  project_skills?: Skill[]
}
