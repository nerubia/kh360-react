import { lazy } from "react"
import { routes } from "./routes"

const Layout = lazy(async () => await import("@components/layouts/Layout"))

const Home = lazy(async () => await import("@pages/home"))
const ExternalEvaluations = lazy(
  async () => await import("@pages/external-evaluations/external-evaluations")
)

export const guestRoutes = {
  element: <Layout />,
  children: [
    {
      path: routes.home,
      element: <Home />,
    },
    {
      path: routes.guest.externalEvaluations,
      element: <ExternalEvaluations />,
    },
  ],
}
