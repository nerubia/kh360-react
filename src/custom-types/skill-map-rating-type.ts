import { type User } from "./user-type"
import { type AnswerOption } from "./answer-option-type"
import { type Skill } from "./skill-type"
import { type SkillMapResult } from "./skill-map-result-type"
import { type SkillMapAdministration } from "./skill-map-admin-type"

export interface SkillMapRating {
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
  users?: User
  skill_map_results?: SkillMapResult
}

export interface SkillMapRatings {
  skill_map_ratings: SkillMapRating[]
  skill_map_administration_id: number
  comment: string
}

export enum RatingAnswerOption {
  Beginner = 1,
  Intermediate = 2,
  Expert = 3,
}
