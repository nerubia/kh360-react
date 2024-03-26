import { type SurveyTemplateAnswer } from "./survey-template-answer-type"

export interface SurveyTemplateCategory {
  id?: number
  name?: string
  category_type?: string
  status?: string | boolean
  surveyTemplateAnswers?: SurveyTemplateAnswer[]
}
