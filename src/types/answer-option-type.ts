export interface AnswerOption {
  id: number
  sequence_no: number
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
