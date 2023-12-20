import { lazy } from "react"
import { Navigate, Outlet, useSearchParams } from "react-router-dom"
import { useAppSelector } from "../hooks/useAppSelector"

const Login = lazy(async () => await import("../pages/auth/login"))
const ForgotPassword = lazy(async () => await import("../pages/auth/forgot_password"))
const ResetPassword = lazy(async () => await import("../pages/auth/reset_password"))

export const authRoutes = {
  element: <AuthRoute />,
  children: [
    {
      path: "/auth/login",
      element: <Login />,
    },
    {
      path: "/auth/forgot",
      element: <ForgotPassword />,
    },
    {
      path: "/auth/reset",
      element: <ResetPassword />,
    },
  ],
}

export default function AuthRoute() {
  const [searchParams] = useSearchParams()
  const callback = searchParams.get("callback")
  const { access_token } = useAppSelector((state) => state.auth)
  return access_token != null ? <Navigate to={callback ?? "/my-evaluations"} /> : <Outlet />
}
