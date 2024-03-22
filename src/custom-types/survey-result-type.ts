import { type User } from "./user-type"
import { type EmailLog } from "./email-log-type"

export interface SurveyResult {
  id?: string
  survey_administration_id?: string
  status?: string
  remarks?: string
  users?: User
  total_questions?: number
  total_answered?: number
  email_logs?: EmailLog[]
}

export interface SurveyResultFilters {
  id?: string
  survey_administration_id?: string
  user_id?: string
  status?: string
}
