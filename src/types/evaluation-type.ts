import { type ProjectRole } from "./project-role-type"
import { type Project } from "./project-type"
import { type User } from "./user-type"
import { type EvaluationTemplate } from "./evaluation-template-type"

export interface Evaluation {
  id: number
  comments?: string
  recommendations?: string
  eval_start_date?: string
  eval_end_date?: string
  percent_involvement?: string
  status?: string
  for_evaluation?: boolean
  is_external?: boolean
  evaluator?: User
  evaluee?: User
  project?: Project
  project_role?: ProjectRole
  template?: EvaluationTemplate
  external_evaluator_id: number
  zscore?: number
}

export interface EvaluationFilters {
  evaluation_administration_id?: string
  evaluator_id?: string
  external_evaluator_id?: string
  for_evaluation?: boolean
  evaluation_template_id?: string
  evaluation_result_id?: string
}

export enum EvaluationStatus {
  Draft = "Draft",
  Excluded = "Excluded",
  Pending = "Pending",
  Open = "Open",
  Ongoing = "Ongoing",
  Submitted = "Submitted",
  Cancelled = "Cancelled",
  Expired = "Expired",
  Reviewed = "Reviewed",
  ForRemoval = "For Removal",
  Removed = "Removed",
}
