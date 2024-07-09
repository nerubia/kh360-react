import { type AnswerOption } from "./answer-option-type"
import { type SkillMapAdministration } from "./skill-map-admin-type"
import { type SkillMapResult } from "./skill-map-result-type"
import { type Skill } from "./skill-type"
import { type User } from "./user-type"

interface SkillCategories {
  name: string
}

export interface SkillMapAdminResult {
  comments?: string
  id: number
  skill_map_administration_id?: number
  skill_map_administrations?: SkillMapAdministration
  skill_map_result_id?: number
  skill_id?: number
  skills?: Skill
  skill_category_id?: number
  other_skill_name?: string
  answer_options?: AnswerOption
  answer_option_id?: number
  skill_categories?: SkillCategories
  users?: User
  skill_map_results?: SkillMapResult
  previous_rating?: AnswerOption
  rating?: AnswerOption
  name: string
}
