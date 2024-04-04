import { type User } from "./user-type"
export interface ExternalUser {
  id: number
  email: string
  first_name: string
  middle_name?: string
  last_name: string
  role: string
  company: string
  related_user?: User
}

export interface ExternalUserFilters {
  name?: string
  company?: string
  role?: string
  page?: string
}
export const externalEvalColumns = ["Name", "Email Address", "Company", "Role", "Actions"]
