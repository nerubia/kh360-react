import { lazy } from "react"

const NotFound = lazy(async () => await import("../pages/404"))

export const otherRoutes = {
  path: "*",
  element: <NotFound />,
}
