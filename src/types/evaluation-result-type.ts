import { type User } from "./user-type"
import { type EvaluationTemplate } from "./evaluation-template-type"

export interface EvaluationResult {
  id: number
  status?: string
  users?: User
  evaluation_templates?: EvaluationTemplate[]
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
