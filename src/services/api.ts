import { type LoginFormData } from "../types/authType"
import { axiosInstance } from "../utils/axiosInstance"

export const loginUser = async (data: LoginFormData) =>
  await axiosInstance.post("/auth/login", data)
