import { type User } from "./user-type"
import { type EmailLog } from "./email-log-type"
import { type SurveyAnswer } from "./survey-answer-type"

export interface SurveyResult {
  id?: string
  survey_administration_id?: string
  status?: string
  remarks?: string
  users?: User
  total_questions?: number
  total_answered?: number
  email_logs?: EmailLog[]
  survey_answers?: SurveyAnswer[]
  companion_user?: User
}

export interface SurveyResultFilters {
  id?: string
  survey_administration_id?: string
  user_id?: string
  status?: string
}

export const columns = ["Name", "Description", "Schedule"]
export enum SurveyResultStatus {
  Open = "Open",
  Draft = "Draft",
  Ready = "Ready",
  Ongoing = "Ongoing",
  Closed = "Closed",
  Submitted = "Submitted",
  Cancelled = "Cancelled",
  NoResult = "No Result",
}
