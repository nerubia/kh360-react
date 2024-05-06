export interface SkillMapAdministration {
  id: number
  name?: string
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
}

export enum SkillMapAdminStatus {
  Draft = "Draft",
  Pending = "Pending",
  Processing = "Processing",
  Ongoing = "Ongoing",
  Closed = "Closed",
  Cancelled = "Cancelled",
}

export interface SkillMapAdminFilters {
  name?: string
  status?: string
  page?: string
}

export const skillMapColumns = ["Name", "Description", "Schedule", "Status"]
