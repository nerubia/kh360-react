import { type User } from "./userType"

export interface EvaluationResults {
  id?: number
  status?: string
  users?: User
}

export interface EvalueeFilters {
  evaluation_administration_id?: string
  name?: string
  status?: string
  page?: string
}

export enum EvaluationResultStatus {
  Reviewed = "reviewed",
  Pending = "pending",
  Draft = "draft",
}
