import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "../hooks/useAppSelector"

export default function PrivateRoute() {
  const location = useLocation()
  const { access_token } = useAppSelector((state) => state.auth)
  return access_token != null ? (
    <Outlet />
  ) : (
    <Navigate to={`/auth/login?callback=${location.pathname}`} />
  )
}
