import { type LoginFormData } from "../types/authType"
import { axiosPublic } from "../utils/axiosPublic"
import { axiosInstance } from "../utils/axiosInstance"

export const refreshUserToken = async () =>
  await axiosPublic.get("/auth/refresh")

export const loginUser = async (data: LoginFormData) =>
  await axiosInstance.post("/auth/login", data)

export const logoutUser = async () => await axiosInstance.post("/user/logout")
export const getProfile = async () => await axiosInstance.get("/user/profile")
