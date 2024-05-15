import { type SkillCategory } from "@custom-types/skill-category-type"
import { type AnswerOption } from "./answer-option-type"

export interface Skill {
  id: number
  name: string
  skill_categories: SkillCategory
  skill_category_id: number
  description: string
  sequence_no: number
  status: boolean
  previous_rating?: AnswerOption
  rating?: AnswerOption
  skills: { id: number; name: string; sequence_no: number; description: string; status: string }
  answer_option_id: number
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
