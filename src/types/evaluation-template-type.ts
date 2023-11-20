import { type Evaluation } from "./evaluation-type"
import { type ProjectRole } from "./projectRoleType"
export interface EvaluationTemplate {
  id: number
  display_name?: string
  project_role?: ProjectRole
  evaluation_details?: Evaluation[]
}

export interface EvaluationTemplateFilters {
  evaluation_result_id?: string
  for_evaluation?: boolean
}
