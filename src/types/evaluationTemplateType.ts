import { type Evaluation } from "./evaluationType"

export interface EvaluationTemplate {
  id: number
  display_name?: string
  evaluation_details?: Evaluation[]
}

export interface EvaluationTemplateFilters {
  evaluation_result_id?: string
  for_evaluation?: boolean
}
