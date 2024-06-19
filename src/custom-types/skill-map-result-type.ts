import { type User } from "./user-type"
import { type EmailLog } from "./email-log-type"
import { type SkillMapRating } from "./skill-map-rating-type"

export interface SkillMapResult {
  id: number
  skill_map_administration_id?: string
  user_id: number
  users?: User
  status?: string
  remarks?: string
  email_logs?: EmailLog[]
  last_skill_map_date?: string
  submitted_date?: string
  skill_map_ratings: SkillMapRating[]
}

export interface SkillMapResultFilters {
  id?: string
  skill_map_administration_id?: string
  user_id?: string
  status?: string
  name?: string
  page?: string
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
