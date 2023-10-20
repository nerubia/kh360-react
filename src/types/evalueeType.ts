import { type User } from "./userType"

export interface EvaluationResults {
  id?: string
  status?: string
  users?: User
}

export interface EvalueeFilters {
  evaluation_administration_id?: string
  name?: string
  status?: string
  page?: string
}
