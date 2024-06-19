import { type EmailLog } from "@custom-types/email-log-type"
import { type Evaluation } from "@custom-types/evaluation-type"
import { type Project } from "@custom-types/project-type"
import { type SkillMapResult } from "./skill-map-result-type"

export interface User {
  id: number
  slug?: string
  email?: string
  first_name?: string
  last_name?: string
  middle_name?: string
  is_active?: boolean
  user_details?: UserDetails
  user_settings?: UserSettings[]
  roles?: string[]
  picture?: string
  role?: string
  company?: string
  is_external?: boolean
  totalSubmitted?: number
  totalEvaluations?: number
  evaluations?: Evaluation[]
  email_logs?: EmailLog[]
  project?: Project
  projectRole?: string
}

export interface UserFilters {
  name?: string
  user_type?: string
  page?: string
}

export interface UserDetails {
  id: number
  user_type?: string
  user_position?: string
  start_date?: string
}

export interface UserSettings {
  id: number
  name?: string
  setting?: string
}

export interface UserEvaluationsFilter {
  evaluation_administration_id?: number
  for_evaluation: number
}

export interface UserQuestionsFilter {
  survey_administration_id?: number
}

export interface UserSkillMap {
  id: number
  name?: string
  skill_map_administration_id?: number
  skill_map_period_start_date?: string
  skill_map_period_end_date?: string
  skill_map_schedule_start_date?: string
  skill_map_schedule_end_date?: string
  remarks?: string
  email_subject?: string
  email_content?: string
  status?: string
  totalSkillMaps?: number
  totalSubmitted?: number
  totalPending?: number
  skill_map_result_status?: string
  skill_map_results: SkillMapResult[]
}
