import { lazy } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useInternalUser } from "@hooks/use-internal-user"
import { routes } from "@routes/routes"

const MyEvaluations = lazy(async () => await import("@pages/my-evaluations/my-evaluations"))
const MyEvaluationResults = lazy(
  async () => await import("@pages/my-evaluations/[id]/my-evaluation-results")
)
const Survey = lazy(async () => await import("@pages/survey/survey"))

export const internalUserRoutes = {
  element: <InternalUserRoute />,
  children: [
    /* {
      path: "/dashboard",
      element: <Dashboard />,
    }, */
    {
      path: routes.private.internalUser.myEvaluations,
      element: <MyEvaluations />,
    },
    {
      path: routes.private.internalUser.myEvaluationResults,
      element: <MyEvaluationResults />,
    },
    {
      path: routes.private.internalUser.surveyForms,
      element: <Survey />,
    },
  ],
}

export default function InternalUserRoute() {
  const isInternalUser = useInternalUser()
  return isInternalUser ? <Outlet /> : <Navigate to='/evaluation-administrations' />
}
