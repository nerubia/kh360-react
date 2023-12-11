import { Navigate, Outlet, useSearchParams } from "react-router-dom"
import { useAppSelector } from "../hooks/useAppSelector"

export default function AuthRoute() {
  const [searchParams] = useSearchParams()
  const callback = searchParams.get("callback")
  const { access_token } = useAppSelector((state) => state.auth)
  return access_token != null ? <Navigate to={callback ?? "/my-evaluations"} /> : <Outlet />
}
