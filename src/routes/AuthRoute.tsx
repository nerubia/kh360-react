import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "../hooks/useAppSelector"

export default function AuthRoute() {
  const { access_token } = useAppSelector((state) => state.auth)
  return access_token != null ? <Navigate to='/dashboard' /> : <Outlet />
}
