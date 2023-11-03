import { type User } from "./userType"

export interface EvaluationResult {
  id: number
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
  ForReview = "For Review",
  Draft = "Draft",
  Ready = "Ready",
}
