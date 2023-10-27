export interface LoginFormData {
  email: string
  password: string
}

export interface EvaluationFormData {
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

export interface EvaluationResultsFormData {
  evaluation_administration_id?: string
  employee_ids: number[]
}
