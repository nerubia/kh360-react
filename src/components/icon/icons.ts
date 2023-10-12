import { lazy } from "react"

export const icons = {
  ChevronLeft: lazy(async () => await import("./icons/ChevronLeftIcon")),
  Close: lazy(async () => await import("./icons/CloseIcon")),
  Dashboard: lazy(async () => await import("./icons/DashboardIcon")),
  Google: lazy(async () => await import("./icons/GoogleIcon")),
  Logout: lazy(async () => await import("./icons/LogoutIcon")),
  Menu: lazy(async () => await import("./icons/MenuIcon")),
  Star: lazy(async () => await import("./icons/StarIcon")),
}
