import { type User } from "./userType"

export interface EvaluationResult {
  id?: number
  status?: string
  users?: User
}

export interface EvaluationResultFilters {
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
