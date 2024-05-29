export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}

export interface SkillMapResultLatest {
  id: number
  skill_map_administration_id: string
  status: string
  remarks: string
  comments: string
  user_id: number
  submitted_date: string
  users: User
  last_skill_map_date: string
}
