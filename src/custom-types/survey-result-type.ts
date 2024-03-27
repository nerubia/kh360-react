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
}

export interface SurveyResultFilters {
  id?: string
  survey_administration_id?: string
  user_id?: string
  status?: string
}

export enum SurveyResultStatus {
  ForReview = "For Review",
  Draft = "Draft",
  Ready = "Ready",
  Ongoing = "Ongoing",
  Closed = "Closed",
  Completed = "Completed",
  Cancelled = "Cancelled",
  NoResult = "No Result",
}
