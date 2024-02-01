import { lazy } from "react"
import { Navigate, Outlet, useSearchParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { routes } from "@routes/routes"

const Login = lazy(async () => await import("@pages/auth/login"))
const ForgotPassword = lazy(async () => await import("@pages/auth/forgot_password"))
const ResetPassword = lazy(async () => await import("@pages/auth/reset_password"))

export const authRoutes = {
  element: <AuthRoute />,
  children: [
    {
      path: routes.auth.login,
      element: <Login />,
    },
    {
      path: routes.auth.forgotPassword,
      element: <ForgotPassword />,
    },
    {
      path: routes.auth.resetPassword,
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
