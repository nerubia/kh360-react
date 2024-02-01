import { lazy } from "react"
import { routes } from "./routes"

const NotFound = lazy(async () => await import("@pages/404"))

export const otherRoutes = {
  path: routes.notFound,
  element: <NotFound />,
}
