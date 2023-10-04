import { type LoginFormData } from "../types/authType"
import { axiosInstance } from "../utils/axiosInstance"

export const login = async (data: LoginFormData) =>
  await axiosInstance.post("/auth/login", data)
