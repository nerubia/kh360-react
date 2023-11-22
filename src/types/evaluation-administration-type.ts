export interface EvaluationAdministration {
  id: number
  name?: string
  eval_period_start_date?: string
  eval_period_end_date?: string
  eval_schedule_start_date?: string
  eval_schedule_end_date?: string
  remarks?: string
  email_subject?: string
  email_content?: string
  status?: string
  totalEvaluations?: number
  totalSubmitted?: number
  totalPending?: number
}

export interface EvaluationAdministrationFilters {
  name?: string
  status?: string
  page?: string
}

export interface ExternalEvaluatorData {
  id: number
  evaluation_template_id: number
  evaluation_result_id: number
  evaluee_id: number
  external_user_ids: number[]
}

export enum EvaluationAdministrationStatus {
  Draft = "Draft",
  Pending = "Pending",
  Processing = "Processing",
  Ongoing = "Ongoing",
  Closed = "Closed",
  Cancelled = "Cancelled",
}
