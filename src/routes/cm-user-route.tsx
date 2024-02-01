import { lazy } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useCmUser } from "@hooks/use-cm-user"
import { routes } from "@routes/routes"

const EvaluationResultsList = lazy(
  async () => await import("@pages/evaluation-results/evaluation-results-list")
)

const ViewEvaluationResults = lazy(
  async () => await import("@pages/evaluation-results/[id]/view-evaluation-results")
)

export const cmUserRoutes = {
  element: <CmUserRoute />,
  children: [
    /**
     * Evaluation Results
     */
    {
      path: routes.private.cmUser.evaluationResultsList,
      element: <EvaluationResultsList />,
    },
    {
      path: routes.private.cmUser.viewEvaluationResults,
      element: <ViewEvaluationResults />,
    },
  ],
}

export default function CmUserRoute() {
  const isCmUser = useCmUser()
  return isCmUser ? <Outlet /> : <Navigate to='/evaluation-administrations' />
}
