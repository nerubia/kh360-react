export interface EvaluationRating {
  id: number
  answer_option_id: number
  ratingSequenceNumber: number
  ratingAnswerType: string
  comments: string
  showInputComment?: boolean
}
