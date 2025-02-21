import { type Skill } from "@custom-types/skill-type"

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

export interface EvaluationTemplateFormData {
  name?: string
  display_name?: string
  description?: string
  template_type?: string
  template_class?: string
  with_recommendation?: number | string | boolean
  evaluator_role_id?: string
  evaluee_role_id?: string
  rate?: string
  answer_id?: string
  is_active: number | string | boolean
  evaluation_template_contents: EvaluationTemplateContentFormData[] | string
}

export interface ExternalUserFormData {
  first_name?: string
  middle_name?: string
  last_name?: string
  user_type?: string
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
  system_name?: string
}

export interface ProjectFormData {
  name?: string
  client_id?: string
  start_date?: string
  end_date?: string
  description?: string
  status?: string
  skill_ids?: number[] | string
}

export interface ProjectMemberFormData {
  id?: string
  project_id?: string
  project_name?: string
  project_member_name?: string
  user_id?: string
  project_role_id?: string
  start_date?: string
  end_date?: string
  allocation_rate?: string
  remarks?: string
  skills?: Array<Partial<Skill>>
}

export interface EvaluationTemplateContentFormData {
  id?: number
  evaluation_template_id?: string
  name?: string
  description?: string
  category?: string
  rate?: string
  is_active?: boolean | string
  sequence_no?: number | string
}

export interface SkillFormData {
  name?: string
  other_skill_name?: string
  description?: string
  skill_category_id?: string
  status?: boolean | string
}

export interface SkillCategoryFormData {
  name?: string
  description?: string
  status?: boolean | string | number
}

export interface SurveyAdministrationFormData {
  name?: string
  survey_start_date?: string
  survey_end_date?: string
  survey_template_id?: string
  remarks?: string
  email_subject?: string
  email_content?: string
}

export interface SurveyResultsFormData {
  survey_administration_id?: string
  employee_ids?: number[]
  companion_ids?: number[]
  is_external?: boolean
}

export interface SkillMapAdminFormData {
  id?: string
  name?: string
  skill_map_period_start_date?: string
  skill_map_period_end_date?: string
  skill_map_schedule_start_date?: string
  skill_map_schedule_end_date?: string
  remarks?: string
  email_subject?: string
  email_content?: string
  status?: string
  file?: string
}

export interface SkillMapResultsFormData {
  skill_map_administration_id?: string
  employee_ids?: number[]
}
