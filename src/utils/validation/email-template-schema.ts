import { boolean, object, string } from "yup"

export const createEmailTemplateSchema = object().shape({
  name: string().required("Name is required"),
  template_type: string().required("Template type is required"),
  is_default: boolean(),
  subject: string(),
  content: string().required("Content is required"),
})
