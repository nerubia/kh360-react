import { type Skill } from "./skill-type"

export interface SkillCategory {
  id: number
  name?: string
  sequence_no?: number
  description?: string
  project_skills?: Skill[]
}
