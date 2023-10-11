import { lazy } from "react"

export const icons = {
  Back: lazy(async () => await import("./icons/BackIcon")),
  Dashboard: lazy(async () => await import("./icons/DashboardIcon")),
  Google: lazy(async () => await import("./icons/GoogleIcon")),
  Star: lazy(async () => await import("./icons/StarIcon")),
}
