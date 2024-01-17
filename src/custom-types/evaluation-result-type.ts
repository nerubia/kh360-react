import { type User } from "@custom-types/user-type"
import { type Evaluation } from "./evaluation-type"
import { type EvaluationTemplate } from "@custom-types/evaluation-template-type"
import { type EvaluationResultDetail } from "@custom-types/evaluation-result-detail-type"
import { type EvaluationAdministration } from "@custom-types/evaluation-administration-type"
import { type ScoreRating } from "@custom-types/score-rating-type"
import { type OtherComment } from "@custom-types/comment-type"
import { type Option } from "./optionType"

export interface EvaluationResult {
  id: number
  status?: string
  users?: User
  evaluation_templates?: EvaluationTemplate[]
  evaluations?: Evaluation[]
  evaluation_result_details?: EvaluationResultDetail[]
  eval_admin_name?: string
  eval_period_start_date: string
  eval_period_end_date: string
  score: number
  score_ratings?: ScoreRating
  zscore: number
  banding: string
  comments: string[]
  other_comments: OtherComment[]
  recommendations: string[]
  evaluation_administration?: EvaluationAdministration
  score_rating?: ScoreRating
  total_score?: number
  attendance_and_punctuality?: AttendanceAndPunctuality[]
}

export interface EvaluationResultFilters {
  id?: string
  evaluation_administration_id?: string
  eval_period_start_date?: string
  eval_period_end_date?: string
  name?: string
  status?: string
  score_ratings_id?: string
  banding?: string
  sort_by?: string
  page?: string
}

export enum EvaluationResultStatus {
  ForReview = "For Review",
  Draft = "Draft",
  Ready = "Ready",
  Ongoing = "Ongoing",
  Completed = "Completed",
  Cancelled = "Cancelled",
  NoResult = "No Result",
}

export interface AttendanceAndPunctuality {
  month?: string
  total_working_days?: number
  days_present?: number
  lates_grace_period?: number
  lates?: number
  vacation_and_birthday_leave_duration?: number
  sick_leave_duration?: number
  emergency_leave_duration?: number
  other_leave_duration?: number
  unpaid_leave_duration?: number
  unfiled_leave_duration?: number
}

export const sortByFilters: Option[] = [
  {
    label: "Employee",
    value: "evaluee",
  },
  {
    label: "Score [Low to High]",
    value: "score_asc",
  },
  {
    label: "Score [High to Low]",
    value: "score_desc",
  },
  {
    label: "Standard Score [Low to High]",
    value: "standard_score_asc",
  },
  {
    label: "Standard Score [High to Low]",
    value: "standard_score_desc",
  },
]

export const columns = [
  "Evaluee Name",
  "Eval Admin Name",
  "Eval Period",
  "Score Rating",
  "Z-Score",
  "Banding",
]