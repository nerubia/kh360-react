import { type SkillCategory } from "./skill-category-type"

export interface Skill {
  id: number
  name: string
  skill_categories: SkillCategory
  sequence_no: number
}
