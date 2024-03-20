export interface EmailTemplate {
  id: number
  name?: string
  template_type?: string
  is_default: boolean
  subject?: string
  content?: string
}

export enum TemplateType {
  CreateEvaluation = "Create Evaluation",
  ResetVerification = "Reset Verification Code",
  EvaluationReminder = "Performance Evaluation Reminder",
  EvaluationComplete = "Evaluation Complete Thank You Message External",
  NARating = "Performance Evaluation NA Rating",
  HighRating = "Performance Evaluation High Rating",
  LowRating = "Performance Evaluation Low Rating",
  ThankYouMsg = "Evaluation Complete Thank You Message",
  NoAvailable = "No Available Evaluation Results",
  NoPending = "No Pending Evaluation Forms",
  RequestRemove = "Request to Remove Evaluation",
  ApproveRequest = "Approved Request to Remove Evaluee",
  DeclineRequest = "Declined Request to Remove Evaluee",
}

export interface EmailTemplateFilters {
  name?: string
  template_type?: string
  is_default?: string
  page?: string
}

export enum EmailTemplateDefault {
  Yes = "Yes",
  No = "No",
}

export interface TemplateTypeOption {
  label: string
}
export const messageTemplateColumns = ["Name", "Template Type", "Subject", "Default", "Actions"]
