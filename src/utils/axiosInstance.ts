import axios, { type AxiosInstance } from "axios"

export let axiosInstance: AxiosInstance

export const setupAxiosInstance = () => {
  axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  })
}
