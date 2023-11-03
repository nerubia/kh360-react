import { type ProjectRole } from "./projectRoleType"
import { type Project } from "./projectType"
import { type User } from "./userType"

export interface Evaluation {
  id: number
  eval_start_date?: string
  eval_end_date?: string
  percent_involvement?: string
  evaluator?: User
  project?: Project
  project_role?: ProjectRole
  for_evaluation?: boolean
}

export interface EvaluationFilters {
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
}
