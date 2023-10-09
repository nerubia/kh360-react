import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "../hooks/useAppSelector"

export default function PrivateRoute() {
  const { accessToken } = useAppSelector((state) => state.auth)
  return accessToken != null ? <Outlet /> : <Navigate to='/auth/login' />
}
