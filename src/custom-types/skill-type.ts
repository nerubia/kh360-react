import { type SkillCategory } from "@custom-types/skill-category-type"

export interface Skill {
  id: number
  name: string
  skill_categories: SkillCategory
  sequence_no: number
}

export interface SkillFilters {
  name?: string
  skill_category_id?: string
  page?: string
  project_id?: string
}
