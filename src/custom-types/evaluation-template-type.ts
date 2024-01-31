import { type Evaluation } from "@custom-types/evaluation-type"
import { type EvaluationTemplateContent } from "@custom-types/evaluation-template-content-type"
import { type ProjectRole } from "@custom-types/project-role-type"
import { type Answer } from "@custom-types/answer-type"

export interface EvaluationTemplate {
  id: number
  name?: string
  display_name?: string
  description?: string
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
  is_active: boolean
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

export enum TemplateClass {
  Internal = "Internal",
  External = "External",
}

export enum TemplateType {
  ProjectEvaluation = "Project Evaluation",
  UnitEvaluation = "Unit Evaluation",
  HREvaluation = "HR Evaluation",
}
