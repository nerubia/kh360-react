export interface AnswerOption {
  id: number
  sequence_no: number
  name: string
  display_name: string
  answer_type: string
  description: string
}

export enum AnswerOptions {
  FivePointStarRating = 1,
}

export enum AnswerType {
  NA = "na",
  Lowest = "lowest",
  Highest = "highest",
}
