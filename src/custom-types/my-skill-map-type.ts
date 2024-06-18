import { type AnswerOption } from "./answer-option-type"

export interface MySkillMap {
  id: number
  name?: string
  skill_map_administration_id?: number
  skill_map_period_start_date?: string
  skill_map_period_end_date?: string
  skill_map_schedule_start_date?: string
  skill_map_schedule_end_date?: string
  remarks?: string
  email_subject?: string
  email_content?: string
  status?: string
  totalSkillMaps?: number
  totalSubmitted?: number
  totalPending?: number
  skill_map_result_status?: string
  skill_map_results: SkillMapResult[]
}

export enum MySkillMapStatus {
  Draft = "Draft",
  Pending = "Pending",
  Processing = "Processing",
  Ongoing = "Ongoing",
  Closed = "Closed",
  Cancelled = "Cancelled",
}

export interface MySkillMapFilters {
  name?: string
  status?: string
  page?: string
}

//   export const skillMapColumns = ["Name", "Description", "Schedule", "Status"]
export interface Skills {
  name: string
}

export interface SkillMapRating {
  skill_id: number
  skills: Skills
  answer_options: AnswerOption
  answer_option_id: number
  created_at: string
}

export interface SkillMapResult {
  skill_map_ratings: SkillMapRating[]
}
