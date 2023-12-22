import { type User } from "./user-type"
import { type EvaluationTemplate } from "./evaluation-template-type"
import { type EvaluationResultDetail } from "./evaluation-result-detail-type"
import { type EvaluationAdministration } from "./evaluation-administration-type"
import { type ScoreRating } from "./score-rating-type"

export interface EvaluationResult {
  id: number
  status?: string
  users?: User
  evaluation_templates?: EvaluationTemplate[]
  evaluation_result_details?: EvaluationResultDetail[]
  eval_admin_name?: string
  eval_period_start_date: string
  eval_period_end_date: string
  score: number
  score_ratings?: ScoreRating
  zscore: number
  banding: string
  comments: string[]
  recommendations: string[]
  evaluation_administration?: EvaluationAdministration
  score_rating?: ScoreRating
  total_score?: number
}

export interface EvaluationResultFilters {
  evaluation_administration_id?: string
  name?: string
  status?: string
  score_ratings_id?: string
  banding?: string
  sort_by?: string
  page?: string
}

export enum EvaluationResultStatus {
  ForReview = "For Review",
  Draft = "Draft",
  Ready = "Ready",
  Ongoing = "Ongoing",
  Completed = "Completed",
  Cancelled = "Cancelled",
}
