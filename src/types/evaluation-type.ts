import { type ProjectRole } from "./projectRoleType"
import { type Project } from "./projectType"
import { type User } from "./userType"
import { type EvaluationTemplate } from "./evaluation-template-type"

export interface Evaluation {
  id: number
  comments?: string
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
}

export interface EvaluationFilters {
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
}
