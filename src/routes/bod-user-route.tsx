import { lazy } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useBodUser } from "../hooks/use-bod-user"

const EvaluationResults = lazy(
  async () => await import("../pages/evaluation-results/evaluation-results")
)

export const bodUserRoutes = {
  element: <BodUserRoute />,
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

export default function BodUserRoute() {
  const isBodUser = useBodUser()
  return isBodUser ? <Outlet /> : <Navigate to='/evaluation-administrations' />
}
