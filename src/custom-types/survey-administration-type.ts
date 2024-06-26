export interface SurveyAdminstration {
  id: number
  name?: string
  survey_start_date?: string
  survey_end_date?: string
  survey_template_id?: string
  remarks?: string
  email_subject?: string
  email_content?: string
  status?: string
  survey_result_status?: string
}

export enum SurveyAdministrationStatus {
  Draft = "Draft",
  Pending = "Pending",
  Processing = "Processing",
  Ongoing = "Ongoing",
  Closed = "Closed",
  Cancelled = "Cancelled",
}

export interface SurveyAdministrationFilters {
  name?: string
  status?: string
  page?: string
}

export const surveyAdminColumns = ["Name", "Description", "Schedule", "Status"]
