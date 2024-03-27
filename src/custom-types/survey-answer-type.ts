import { type SurveyTemplateAnswer } from "./survey-template-answer-type"
import { type User } from "./user-type"

export interface SurveyAnswer {
  id?: number
  survey_template_answer_id?: number
  survey_template_question_id?: number
  survey_template_answers?: SurveyTemplateAnswer
  users?: User[]
  totalCount?: number
}

export interface SurveyAnswers {
  survey_administration_id: number
  survey_answers: SurveyAnswer[]
}
