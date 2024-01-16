import { type Client } from "./client-type"
import { type Skill } from "./skill-type"
import { type ProjectMember } from "./project-member-type"

export interface Project {
  id: number
  name?: string
  status?: string
  description?: string
  client?: Client
  start_date?: string
  end_date?: string
  project_skills?: Skill[]
  project_members?: ProjectMember[]
}

export interface ProjectFilters {
  name?: string
  client?: string
  skills?: string
  status?: string
  page?: string
}

export enum ProjectStatus {
  Draft = "Draft",
  Ongoing = "Ongoing",
  Closed = "Closed",
  Hold = "Hold",
  Cancelled = "Cancelled",
}
