import { type AnswerOption } from "./answer-option-type"
import { type EvaluationRating } from "./evaluation-rating-type"

export interface EvaluationTemplateContent {
  id: number
  name?: string
  description?: string
  answerId?: number
  answerOptions?: AnswerOption[]
  evaluationRating: EvaluationRating
  average_rate?: number
  category?: string
  rate?: string
  is_active?: boolean
  sequence_no?: number
}

export interface EvaluationTemplateContentFilters {
  evaluation_id?: string
}

export enum EvaluationTemplateContentCategory {
  PrimarySkillSet = "Primary Skillset",
  SecondarySkillSet = "Secondary Skillset",
}
