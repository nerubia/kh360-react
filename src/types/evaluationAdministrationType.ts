export interface EvaluationAdministration {
  id?: string
  name?: string
  eval_period_start_date?: string
  eval_period_end_date?: string
  eval_schedule_start_date?: string
  eval_schedule_end_date?: string
  remarks?: string
  email_subject?: string
  email_content?: string
  status?: string
}

export interface EvaluationAdministrationFilters {
  name?: string
  status?: string
  page?: string
}

export enum EvaluationAdministrationStatus {
  Draft = "Draft",
  Pending = "Pending",
  Ongoing = "Ongoing",
  Closed = "Closed",
  Cancelled = "Cancelled",
}
