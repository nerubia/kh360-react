import { lazy } from "react"

export const icons = {
  Ban: lazy(async () => await import("./icons/ban-icon")),
  Check: lazy(async () => await import("./icons/check-icon")),
  ChevronUp: lazy(async () => await import("./icons/chevron-up-icon")),
  ChevronDown: lazy(async () => await import("./icons/chevron-down-icon")),
  ChevronLeft: lazy(async () => await import("./icons/chevron-left-icon")),
  ChevronRight: lazy(async () => await import("./icons/chevron-right-icon")),
  ChevronsLeft: lazy(async () => await import("./icons/chevrons-left-icon")),
  ChevronsRight: lazy(async () => await import("./icons/chevrons-right-icon")),
  ClipboardCheck: lazy(async () => await import("./icons/clipboard-check-icon")),
  Close: lazy(async () => await import("./icons/close-icon")),
  Dashboard: lazy(async () => await import("./icons/dashboard-icon")),
  FileText: lazy(async () => await import("./icons/file-text-icon")),
  Google: lazy(async () => await import("./icons/google-icon")),
  Logout: lazy(async () => await import("./icons/logout-icon")),
  Menu: lazy(async () => await import("./icons/menu-icon")),
  PenSquare: lazy(async () => await import("./icons/pen-square-icon")),
  Plus: lazy(async () => await import("./icons/plus-icon")),
  Star: lazy(async () => await import("./icons/star-icon")),
  Trash: lazy(async () => await import("./icons/trash-icon")),
  UserFill: lazy(async () => await import("./icons/user-fill-icon")),
}
