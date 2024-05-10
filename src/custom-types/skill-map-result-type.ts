import { type User } from "./user-type"
import { type EmailLog } from "./email-log-type"

export interface SkillMapResult {
  id: number
  skill_map_administration_id?: string
  status?: string
  remarks?: string
  users?: User
  email_logs?: EmailLog[]
  last_skill_map_date?: string
}

export interface SkillMapResultFilters {
  id?: string
  skill_map_administration_id?: string
  user_id?: string
  status?: string
}

export const columns = ["Employee Name", "Latest Skill Map"]

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
