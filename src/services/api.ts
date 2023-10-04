import { type LoginFormData } from "../types/authType"
import { axiosPublic } from "../utils/axiosPublic"
import { axiosInstance } from "../utils/axiosInstance"

export const refreshUserToken = async () =>
  await axiosPublic.get("/auth/refresh")

export const loginUser = async (data: LoginFormData) =>
  await axiosInstance.post("/auth/login", data)
