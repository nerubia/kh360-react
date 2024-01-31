export interface Answers {
  evaluation_id: number
  evaluation_rating_ids?: number[]
  evaluation_rating_comments?: string[]
  answer_option_ids?: number[]
  comment?: string
  recommendation?: string
  is_submitting?: boolean
}
