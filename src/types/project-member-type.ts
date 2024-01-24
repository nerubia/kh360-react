import { type Project } from "./project-type"
import { type User } from "./user-type"
import { type ProjectMemberSkill } from "./project-member-skill-type"

export interface ProjectMember {
  id: number
  project_id?: number
  user_id?: number
  start_date?: string
  end_date?: string
  allocation_rate?: number
  project?: Project
  user?: User
  role?: string
  color?: string
  project_role_id?: string
  remarks?: string
  project_member_skills?: ProjectMemberSkill[]
}

export interface ProjectMemberFilters {
  evaluation_administration_id?: string
  evaluation_result_id?: string
  evaluation_template_id?: string
}

export interface SearchProjectMemberFilters {
  start_date?: string
  end_date?: string
  name?: string
  project_name?: string
  role?: string
  user_id?: number
  overlap?: number
}
