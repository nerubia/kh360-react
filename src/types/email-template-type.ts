export interface EmailTemplate {
  id: number
  name?: string
  template_type?: string
  subject?: string
  content?: string
}

export enum TemplateType {
  CreateEvaluation = "Create Evaluation",
  NARating = "Performance Evaluation NA Rating",
  HighRating = "Performance Evaluation High Rating",
  LowRating = "Performance Evaluation Low Rating",
}
