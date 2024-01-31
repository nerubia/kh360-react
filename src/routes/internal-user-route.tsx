import { lazy } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useInternalUser } from "@hooks/use-internal-user"

const MyEvaluations = lazy(async () => await import("@pages/my-evaluations/my-evaluations"))
const MyEvaluationResults = lazy(
  async () => await import("@pages/my-evaluations/[id]/my-evaluation-results")
)

export const internalUserRoutes = {
  element: <InternalUserRoute />,
  children: [
    /* {
      path: "/dashboard",
      element: <Dashboard />,
    }, */
    {
      path: "/my-evaluations",
      element: <MyEvaluations />,
    },
    {
      path: "/my-evaluations/:id",
      element: <MyEvaluationResults />,
    },
  ],
}

export default function InternalUserRoute() {
  const isInternalUser = useInternalUser()
  return isInternalUser ? <Outlet /> : <Navigate to='/evaluation-administrations' />
}
