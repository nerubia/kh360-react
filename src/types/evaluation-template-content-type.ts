import { type AnswerOption } from "./answer-option-type"
import { type EvaluationRating } from "./evaluation-rating-type"

export interface EvaluationTemplateContent {
  id: number
  name?: string
  description?: string
  answerId?: number
  answerOptions?: AnswerOption[]
  evaluationRating: EvaluationRating
}

export interface EvaluationTemplateContentFilters {
  evaluation_id?: string
}
