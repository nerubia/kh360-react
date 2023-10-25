export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  user_details?: UserDetails
  roles: string[]
  picture?: string
}

export interface EmployeeFilters {
  name?: string
  user_type?: string
  page?: string
}

export interface UserDetails {
  user_type?: string
  user_position?: string
  start_date?: string
}
