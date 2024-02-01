import { lazy } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { internalUserRoutes } from "@routes/internal-user-route"
import { cmUserRoutes } from "@routes/cm-user-route"
import { adminRoutes } from "@routes/admin-route"
import { routes } from "@routes/routes"

const DashboardLayout = lazy(async () => await import("@components/layouts/dashboard-layout"))

const UserEvaluationAdministrations = lazy(
  async () => await import("@pages/evaluations/user-evaluation-administrations")
)
const Evaluations = lazy(async () => await import("@pages/evaluations/[id]/evaluations"))

export const privateRoutes = {
  element: <PrivateRoute />,
  children: [
    {
      element: <DashboardLayout />,
      children: [
        {
          path: routes.private.userEvaluationAdministrations,
          element: <UserEvaluationAdministrations />,
        },
        {
          path: routes.private.userEvaluations,
          element: <Evaluations />,
        },
        internalUserRoutes,
        cmUserRoutes,
        adminRoutes,
      ],
    },
  ],
}

export default function PrivateRoute() {
  const location = useLocation()
  const { access_token } = useAppSelector((state) => state.auth)
  return access_token != null ? (
    <Outlet />
  ) : (
    <Navigate to={`/auth/login?callback=${location.pathname}`} />
  )
}
