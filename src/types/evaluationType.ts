import { type ProjectRole } from "./projectRoleType"
import { type Project } from "./projectType"
import { type User } from "./userType"

export interface Evaluation {
  id?: string
  percent_involvement?: string
  eval_start_date?: string
  eval_end_date?: string
  evaluator?: User
  project?: Project
  project_role?: ProjectRole
}

export interface EvaluationFilters {
  evaluation_template_id?: string
  evaluation_result_id?: string
}
