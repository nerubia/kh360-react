import { type Skill } from "@custom-types/skill-type"

export interface SkillCategory {
  id: number
  name?: string
  sequence_no?: number
  description?: string
  project_skills?: Skill[]
  status?: boolean
  skills?: Skill[]
}

export interface SkillCategoryFilters {
  name?: string
  status?: string
  page?: string
  includes?: string[]
}

export enum SkillCategoryStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export const skillCategoryColumns = ["Name", "Description", "Status", "Actions"]
