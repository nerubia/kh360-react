import { type Project } from "./projectType"

export interface ProjectMember {
  id: number
  project_id?: number
  user_id?: number
  start_date?: string
  end_date?: string
  allocation_rate?: number
  project?: Project
}

export interface ProjectMemberFilters {
  evaluation_administration_id?: string
  evaluation_result_id?: string
  evaluation_template_id?: string
}
