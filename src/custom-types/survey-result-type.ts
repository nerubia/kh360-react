import { type User } from "./user-type"

export interface SurveyResult {
  id?: string
  survey_administration_id?: string
  status?: string
  remarks?: string
  users?: User
}

export interface SurveyResultFilters {
  id?: string
  survey_administration_id?: string
  user_id?: string
  status?: string
}
