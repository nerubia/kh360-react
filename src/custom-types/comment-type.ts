import { type User } from "@custom-types/user-type"
export interface Comment {
  evaluation_id: number
  comment: string
}

export interface OtherComment {
  comment: string
  evaluator: User
}