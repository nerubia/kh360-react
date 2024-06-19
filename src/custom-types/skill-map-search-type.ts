import { type AnswerOption } from "./answer-option-type"
import { type SkillMapAdministration } from "./skill-map-admin-type"

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}
interface SkillMapRating {
  id: number
  skill_map_administration_id: number
  skill_map_result_id: number
  skill_id: number
  skill_category_id: number
  answer_option_id: number
  answer_options?: AnswerOption
  comments: string | null
  status: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  skills: {
    name: string
  }
}

export interface SkillMapSearch {
  id: number
  skill_map_administration_id?: number
  skill_map_administrations?: SkillMapAdministration
  status?: string
  comments?: string
  skill?: string | undefined
  name?: string | undefined
  submitted_date?: Date
  users?: User
  skill_map_ratings?: SkillMapRating[]
}

export interface SkillMapSearchFilters {
  name?: string
  skill?: string
  page?: string
}

export const columns = ["Name", "Skill", "Latest Rating", "Details"]

export enum SkillMapSearchSortOptions {
  SKILL_RATING_DESC = "skill_rating_desc",
  SKILL_RATING_ASC = "skill_rating_asc",
  NAME = "name",
  SKILL = "skill",
}

export const SkillMapSearchSortNames = {
  [SkillMapSearchSortOptions.SKILL_RATING_DESC]: "Skill Rating (Highest to Lowest)",
  [SkillMapSearchSortOptions.SKILL_RATING_ASC]: "Skill Rating (Lowest to Highest)",
  [SkillMapSearchSortOptions.NAME]: "Name",
  [SkillMapSearchSortOptions.SKILL]: "Skill",
}
