import { type SurveyTemplateAnswer } from "./survey-template-answer-type"

export interface SurveyAnswer {
  id?: number
  survey_template_answer_id?: number
  survey_template_question_id?: number
  answer_text?: string
  amount?: string | number
  survey_template_answers?: SurveyTemplateAnswer
}

export interface SurveyAnswers {
  survey_administration_id: number
  survey_answers: SurveyAnswer[]
}
