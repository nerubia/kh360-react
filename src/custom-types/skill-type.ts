import { type SkillCategory } from "@custom-types/skill-category-type"

export interface Skill {
  id: number
  name: string
  skill_categories: SkillCategory
  skill_category_id: number
  description: string
  sequence_no: number
  status: boolean
}

export interface SkillFilters {
  name?: string
  skill_category_id?: string
  page?: string
  items?: string
  project_id?: string
  status?: boolean | string
}

export enum SkillStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export const skillColumns = ["Name", "Category", "Description", "Status", "Actions"]
