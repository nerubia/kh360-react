import { type ScoreRating } from "@custom-types/score-rating-type"
import { type EvaluationTemplateContent } from "@custom-types/evaluation-template-content-type"

export interface EvaluationResultDetail {
  id: number
  score: number
  weight: number
  zscore: number
  banding: string
  template_name: string
  score_rating: ScoreRating
  total_score: number
  evaluation_template_contents: EvaluationTemplateContent[]
}
