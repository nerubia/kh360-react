import { lazy } from "react"

export const icons = {
  Ban: lazy(async () => await import("./icons/BanIcon")),
  Check: lazy(async () => await import("./icons/CheckIcon")),
  ChevronUp: lazy(async () => await import("./icons/ChevronUpIcon")),
  ChevronDown: lazy(async () => await import("./icons/ChevronDownIcon")),
  ChevronLeft: lazy(async () => await import("./icons/ChevronLeftIcon")),
  ChevronRight: lazy(async () => await import("./icons/ChevronRightIcon")),
  ChevronsLeft: lazy(async () => await import("./icons/ChevronsLeftIcon")),
  ChevronsRight: lazy(async () => await import("./icons/ChevronsRightIcon")),
  Close: lazy(async () => await import("./icons/CloseIcon")),
  Dashboard: lazy(async () => await import("./icons/DashboardIcon")),
  Google: lazy(async () => await import("./icons/GoogleIcon")),
  Logout: lazy(async () => await import("./icons/LogoutIcon")),
  Menu: lazy(async () => await import("./icons/MenuIcon")),
  PenSquare: lazy(async () => await import("./icons/PenSquareIcon")),
  Plus: lazy(async () => await import("./icons/PlusIcon")),
  Star: lazy(async () => await import("./icons/StarIcon")),
  Trash: lazy(async () => await import("./icons/TrashIcon")),
  UserFill: lazy(async () => await import("./icons/UserFillIcon")),
}
