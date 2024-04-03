import { object, string } from "yup"

export const externalAuthSchema = object().shape({
  code: string().required("Code is required"),
})

export const createExternalUserSchema = object().shape({
  email: string()
    .email()
    .required("Email is required")
    .max(255, "Should not exceed 255 characters."),
  first_name: string()
    .required("First name is required")
    .max(100, "Should not exceed 100 characters."),
  middle_name: string().optional().max(75, "Should not exceed 75 characters."),
  last_name: string().required("Last name is required").max(75, "Should not exceed 75 characters."),
  role: string().required("Role is required").max(255, "Should not exceed 255 characters."),
  company: string().required("Company is required").max(255, "Should not exceed 255 characters."),
})

export const createExternalUserSurveySchema = object().shape({
  first_name: string()
    .required("First name is required")
    .max(100, "Should not exceed 100 characters."),
  middle_name: string().optional().max(75, "Should not exceed 75 characters."),
  last_name: string().required("Last name is required").max(75, "Should not exceed 75 characters."),
})
