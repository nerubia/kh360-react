import { type ProjectRole } from "./projectRoleType"
import { type Project } from "./projectType"
import { type User } from "./userType"

export interface Evaluation {
  id: number
  eval_start_date?: string
  eval_end_date?: string
  percent_involvement?: string
  status?: string
  for_evaluation?: boolean
  evaluator?: User
  evaluee?: User
  project?: Project
  project_role?: ProjectRole
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
}
