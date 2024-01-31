import { lazy } from "react"

const Layout = lazy(async () => await import("@components/layouts/Layout"))

const Home = lazy(async () => await import("@pages/home"))
const ExternalEvaluations = lazy(
  async () => await import("@pages/external-evaluations/external-evaluations")
)

export const guestRoutes = {
  element: <Layout />,
  children: [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/external-evaluations/:id/evaluations/:evaluation_id",
      element: <ExternalEvaluations />,
    },
  ],
}
