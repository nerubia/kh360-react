interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}
interface SkillMapRating {
  id: number
  skill_map_administration_id: number
  skill_map_result_id: number
  skill_id: number
  skill_category_id: number
  answer_option_id: number
  comments: string | null
  status: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  skills: {
    name: string
  }
}

export interface SkillMapSearch {
  id: number
  skill_map_administration_id?: number
  status?: string
  comments?: string
  skill?: string | undefined
  name?: string | undefined
  submitted_date?: Date
  users?: User
  skill_map_ratings?: SkillMapRating[]
}

export interface SkillMapSearchFilters {
  name?: string
  skill?: string
  page?: string
}

export const columns = ["Name", "Skill"]
