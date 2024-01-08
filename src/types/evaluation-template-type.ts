import { type Evaluation } from "./evaluation-type"
import { type ProjectRole } from "./projectRoleType"

export interface EvaluationTemplate {
  id: number
  name?: string
  display_name?: string
  template_type?: string
  with_recommendation?: boolean
  evaluator_role_id?: string
  evaluee_role_id?: string
  rate?: string
  project_role?: ProjectRole
  evaluation_details?: Evaluation[]
}

export interface EvaluationTemplateFilters {
  evaluation_result_id?: string
  for_evaluation?: boolean
  name?: string
  display_name?: string
  template_type?: string
  evaluator_role_id?: string
  evaluee_role_id?: string
  page?: string
}
