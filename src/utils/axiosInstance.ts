import axios, { type AxiosInstance } from "axios"
import { type Store } from "@reduxjs/toolkit"
import { type RootState } from "../redux/store"

export let axiosInstance: AxiosInstance

export const setupAxiosInstance = (store: Store<RootState>) => {
  axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  })

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.accessToken
      if (token != null) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    async (error) => await Promise.reject(error)
  )
}
