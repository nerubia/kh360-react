import { type SurveyAnswer } from "./survey-answer-type"
import { type SurveyTemplateQuestion } from "./survey-template-question-type"

export interface SurveyUserCompanion {
  survey_answers: SurveyAnswer[]
  survey_template_questions: SurveyTemplateQuestion[]
}
