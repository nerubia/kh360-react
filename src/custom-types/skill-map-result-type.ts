import { type User } from "./user-type"
import { type EmailLog } from "./email-log-type"

export interface SkillMapResult {
  id?: string
  skill_map_administration_id?: string
  status?: string
  remarks?: string
  users?: User
  email_logs?: EmailLog[]
}

export interface SkillMapResultFilters {
  id?: string
  skill_map_administration_id?: string
  user_id?: string
  status?: string
}

export const columns = ["Name", "Description", "Schedule"]

export enum SkillMapResultStatus {
  Open = "Open",
  Draft = "Draft",
  Ready = "Ready",
  Ongoing = "Ongoing",
  Closed = "Closed",
  Submitted = "Submitted",
  Cancelled = "Cancelled",
  NoResult = "No Result",
}
