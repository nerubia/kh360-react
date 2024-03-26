import { type SurveyTemplateCategory } from "./survey-template-category-type"
import { type SurveyTemplateQuestionRule } from "./survey-template-question-rule-type"

export interface SurveyTemplateQuestion {
  id?: number
  sequence_no?: string
  question_type?: string
  question_text?: string
  is_active?: string | boolean
  is_required?: boolean
  surveyTemplateCategories?: SurveyTemplateCategory[]
  survey_template_question_rules?: SurveyTemplateQuestionRule[]
}
