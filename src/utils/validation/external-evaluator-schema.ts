import { object, string } from "yup"

export const externalAuthSchema = object().shape({
  code: string().min(8, "Code must be at least 8 characters").required("Code is required"),
})

export const createExternalUserSchema = object().shape({
  email: string().email().required("Email is required"),
  first_name: string().required("First name is required"),
  middle_name: string().optional(),
  last_name: string().required("Last name is required"),
  role: string().required("Role is required"),
  company: string().required("Company is required"),
})
