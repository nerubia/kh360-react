export interface LoginFormData {
  email: string
  password: string
}

export interface ExternalAuthFormData {
  token?: string
  code?: string
}

export interface EvaluationAdministrationFormData {
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

export interface EvaluationFormData {
  project_id?: number
  project_member_id?: number
}

export interface EvaluationResultsFormData {
  evaluation_administration_id?: string
  employee_ids: number[]
}

export interface ExternalUserFormData {
  first_name?: string
  middle_name?: string
  last_name?: string
  email?: string
  role?: string
  company?: string
}

export interface EvaluatorFormData {
  id?: string
  evaluation_template_id?: string
  evaluation_result_id?: string
  evaluee_id?: string
  project_member_id?: string
  user_id?: string
  is_external?: string
}

export interface EmailTemplateFormData {
  name?: string
  template_type?: string
  is_default?: boolean | string
  subject?: string
  content?: string
}

export interface ProjectMemberFormData {
  project_id?: string
  user_id?: string
  project_role_id?: string
  start_date?: string
  end_date?: string
  allocation_rate?: string
  remarks?: string
}
