import { lazy } from "react"

export const icons = {
  Check: lazy(async () => await import("./icons/CheckIcon")),
  ChevronLeft: lazy(async () => await import("./icons/ChevronLeftIcon")),
  Close: lazy(async () => await import("./icons/CloseIcon")),
  Dashboard: lazy(async () => await import("./icons/DashboardIcon")),
  Google: lazy(async () => await import("./icons/GoogleIcon")),
  Logout: lazy(async () => await import("./icons/LogoutIcon")),
  Menu: lazy(async () => await import("./icons/MenuIcon")),
  Plus: lazy(async () => await import("./icons/PlusIcon")),
  Star: lazy(async () => await import("./icons/StarIcon")),
}
