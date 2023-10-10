import { lazy } from "react"

export const icons = {
  DashboardIcon: lazy(async () => await import("./icons/DashboardIcon")),
  GoogleIcon: lazy(async () => await import("./icons/GoogleIcon")),
  StarIcon: lazy(async () => await import("./icons/StarIcon")),
}
