import { axiosPublic } from "@utils/axiosPublic"
import { axiosInstance } from "@utils/axios-instance"

export const refreshUserToken = async () => await axiosPublic.get("/auth/refresh")

export const getSchema = async () => await axiosInstance.get("/admin/json-schema")
export const getProfile = async () => await axiosInstance.get("/user/profile")
export const sendMail = async () => await axiosInstance.get("/user/mail")
