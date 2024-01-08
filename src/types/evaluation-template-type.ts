import { type Evaluation } from "./evaluation-type"
import { type EvaluationTemplateContent } from "./evaluation-template-content-type"
import { type ProjectRole } from "./project-role-type"
import { type Answer } from "./answer-type"

export interface EvaluationTemplate {
  id: number
  name?: string
  display_name?: string
  template_type?: string
  template_class?: string
  with_recommendation?: boolean
  evaluator_role_id?: string
  evaluee_role_id?: string
  rate?: string
  project_role?: ProjectRole
  evaluation_details?: Evaluation[]
  evaluationTemplateContents?: EvaluationTemplateContent[]
  evaluatorRole?: ProjectRole
  evalueeRole?: ProjectRole
  answer?: Answer
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
