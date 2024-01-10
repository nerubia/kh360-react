import { type Client } from "./client-type"

export interface Project {
  id: number
  name?: string
  status?: string
  description?: string
  client?: Client
}

export interface ProjectFilters {
  name?: string
  client?: string
  skills?: string
  status?: string
  page?: string
}
