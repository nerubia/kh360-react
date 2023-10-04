import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "../hooks/useAppSelector"

export const AuthRoute = () => {
  const { accessToken } = useAppSelector((state) => state.auth)
  return accessToken != null ? <Navigate to='/dashboard' /> : <Outlet />
}
