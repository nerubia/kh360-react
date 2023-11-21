export interface ExternalEvaluator {
  id: number
  email: string
  first_name: string
  middle_name?: string
  last_name: string
  role: string
  company: string
}

export interface ExternalEvaluatorFilters {
  name?: string
  company?: string
  role?: string
  page?: string
}
