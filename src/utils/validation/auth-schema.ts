import { object, string } from "yup"

export const loginSchema = object().shape({
  email: string().email("Invalid email format").required("Email is required"),
  password: string().required("Password is required"),
})
