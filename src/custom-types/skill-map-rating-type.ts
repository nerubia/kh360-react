import { type User } from "./user-type"
import { type AnswerOption } from "./answer-option-type"
import { type Skill } from "./skill-type"

export interface SkillMapRating {
  id?: number
  skill_map_administration_id?: number
  skill_map_result_id?: number
  skill_id?: number
  skills?: Skill
  answer_options?: AnswerOption
  answer_option_id?: number
  users?: User
}

export interface SkillMapRatings {
  skill_map_ratings: SkillMapRating[]
  skill_map_administration_id: number
}

export enum RatingAnswerOption {
  Beginner = 1,
  Intermediate = 2,
  Expert = 3,
}
