import { type AnswerOption } from "./answerOptionType"
import { type EvaluationRating } from "./evaluationRatingType"

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
