import { boolean, object, string } from "yup"

export const createEmailTemplateSchema = object().shape({
  name: string()
    .required("Name is required")
    .max(255, "Message template should not exceed 255 characters."),
  template_type: string()
    .required("Template Type is required")
    .max(100, "Template type should not exceed 100 characters."),
  is_default: boolean(),
  subject: string().max(255, "Subject should not exceed 255 characters."),
  content: string().required("Content is required"),
})
