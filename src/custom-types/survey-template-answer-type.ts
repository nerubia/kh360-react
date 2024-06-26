import { type SurveyTemplateCategory } from "./survey-template-category-type"

export interface SurveyTemplateAnswer {
  id?: number
  survey_template_id?: number | string
  sequence_no?: number
  answer_text?: string
  answer_description?: string
  amount?: string | number
  answer_image?: string
  is_active?: string | boolean
  survey_template_categories?: SurveyTemplateCategory
}
