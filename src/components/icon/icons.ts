import { lazy } from "react"

export const icons = {
  DashboardIcon: lazy(async () => await import("./assets/DashboardIcon")),
  GoogleIcon: lazy(async () => await import("./assets/GoogleIcon")),
}
