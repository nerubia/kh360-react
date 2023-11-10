export interface User {
  id: number
  slug?: string
  email?: string
  first_name?: string
  last_name?: string
  is_active?: boolean
  user_details?: UserDetails
  roles?: string[]
  picture?: string
}

export interface UserFilters {
  name?: string
  user_type?: string
  page?: string
}

export interface UserDetails {
  id: number
  user_type?: string
  user_position?: string
  start_date?: string
}
export interface UserEvaluationsFilter {
  evaluation_administration_id?: number
  for_evaluation: boolean
}
