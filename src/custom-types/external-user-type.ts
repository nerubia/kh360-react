export interface ExternalUser {
  id: number
  email: string
  first_name: string
  middle_name?: string
  last_name: string
  role: string
  company: string
}

export interface ExternalUserFilters {
  name?: string
  company?: string
  role?: string
  page?: string
}
