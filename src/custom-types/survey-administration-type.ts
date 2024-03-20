export interface SurveyAdminstration {
  id: number
  name?: string
  survey_start_date?: string
  survey_end_date?: string
  remarks?: string
  email_subject?: string
  email_content?: string
  status?: string
}

export enum SurveyAdministrationStatus {
  Draft = "Draft",
  Pending = "Pending",
  Processing = "Processing",
  Ongoing = "Ongoing",
  Closed = "Closed",
  Cancelled = "Cancelled",
  Published = "Published",
}

export interface SurveyAdministrationFilters {
  name?: string
  status?: string
  page?: string
}

export const surveyAdminColumns = ["Name", "Description", "Schedule", "Status"]
