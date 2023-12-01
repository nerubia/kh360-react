import { type User } from "./user-type"
import { type EvaluationTemplate } from "./evaluation-template-type"
import { type EvaluationResultDetail } from "./evaluation-result-detail-type"

export interface EvaluationResult {
  id: number
  status?: string
  users?: User
  evaluation_templates?: EvaluationTemplate[]
  evaluation_result_details?: EvaluationResultDetail[]
  eval_period_start_date: string
  eval_period_end_date: string
  score: number
  zscore: number
  banding: string
  comments: string[]
}

export interface EvaluationResultFilters {
  evaluation_administration_id?: string
  name?: string
  status?: string
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
