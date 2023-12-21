import { lazy } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useCmUser } from "../hooks/use-cm-user"

const EvaluationResults = lazy(
  async () => await import("../pages/evaluation-results/evaluation-results")
)

export const cmUserRoutes = {
  element: <CmUserRoute />,
  children: [
    /**
     * Evaluation Results
     */
    {
      path: "/evaluation-results",
      element: <EvaluationResults />,
    },
  ],
}

export default function CmUserRoute() {
  const isCmUser = useCmUser()
  return isCmUser ? <Outlet /> : <Navigate to='/evaluation-administrations' />
}
