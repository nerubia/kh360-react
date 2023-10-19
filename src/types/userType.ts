export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  user_type: string
  user_position: string
  start_date: string
  roles: string[]
}

export interface EmployeeFilters {
  name?: string
  user_type?: string
  page?: string
}
