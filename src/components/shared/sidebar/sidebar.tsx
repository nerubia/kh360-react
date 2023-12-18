import { useAppSelector } from "../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAdmin } from "../../../hooks/useAdmin"
import { setActiveSidebar } from "../../../redux/slices/appSlice"
import { logout } from "../../../redux/slices/auth-slice"
import { Icon } from "../../ui/icon/icon"
import { Button } from "../../ui/button/button"
import { Menu } from "../Menu"
import { type icons } from "../../ui/icon/icons"
import { useInternalUser } from "../../../hooks/use-internal-user"
import { useLocation } from "react-router-dom"

interface MenuLink {
  title: string
  link: string
  icon: string
  access: string
  children?: MenuLink[]
}

const menuLinks: MenuLink[] = [
  /* {
    title: "Sample",
    link: "/sample",
    access: "Admin",
  },
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: "Dashboard",
    access: "Internal",
  }, */
  {
    title: "My Evaluations",
    link: "/my-evaluations",
    icon: "ClipboardCheck",
    access: "Internal",
  },
  {
    title: "Evaluation Forms",
    link: "/evaluation-administrations",
    icon: "FileText",
    access: "Public",
  },
  {
    title: "KH360 Admin",
    link: "/admin/evaluation-administrations",
    icon: "UserRoundCog",
    access: "Admin",
    children: [
      {
        title: "Evaluation Admin",
        link: "/admin/evaluation-administrations",
        icon: "PenSquare",
        access: "Admin",
      },
      {
        title: "External Evaluators",
        link: "/admin/external-evaluators",
        icon: "UserFill",
        access: "Admin",
      },
      {
        title: "Project Assignments",
        link: "/admin/project-assignments",
        icon: "GanttChart",
        access: "Admin",
      },
    ],
  },
]

export const Sidebar = () => {
  const location = useLocation()

  const { activeSidebar } = useAppSelector((state) => state.app)
  const { user } = useAppSelector((state) => state.auth)
  const appDispatch = useAppDispatch()
  const isInternal = useInternalUser()
  const isAdmin = useAdmin()

  const toggleSidebar = () => {
    appDispatch(setActiveSidebar(!activeSidebar))
  }

  const handleLogout = async () => {
    await appDispatch(logout())
  }

  const isParentActive = (menuLink: MenuLink) => {
    if (menuLink.children !== undefined) {
      for (const child of menuLink.children) {
        if (child.link === location.pathname) {
          return true
        }
      }
    }
    return false
  }

  return (
    <div
      className={`${
        activeSidebar ? "w-full md:w-64" : "w-64 -ml-64"
      } bg-primary-500 fixed z-10 h-screen transition-all duration-300`}
    >
      <div className='relative h-full flex flex-col gap-4 p-5'>
        <div className='block absolute top-5 md:hidden'>
          <Button testId='SidebarCloseButton' variant='ghost' size='small' onClick={toggleSidebar}>
            <Icon icon='Close' />
          </Button>
        </div>
        <div className='flex justify-center'>
          <img className='h-20 rounded-full ' src='/logo.png' />
        </div>
        <h1 className='text-white text-lg text-center font-bold'>
          {user?.first_name} {user?.last_name}
        </h1>
        <div className='flex-1 flex flex-col gap-2'>
          {menuLinks.map(
            (menu, index) =>
              ((isInternal && menu.access === "Internal") ||
                (isAdmin && menu.access === "Admin") ||
                menu.access === "Public") && (
                <div key={index} className='flex flex-col gap-2'>
                  <Menu
                    to={menu.link}
                    isEvaluation={false}
                    className={`w-full rounded-md flex justify-between items-center bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-primary-200 [&.active]:bg-primary-700 [&.active]:cursor-default h-9 text-base px-4 ${
                      isParentActive(menu) ? "!bg-primary-700" : ""
                    }`}
                  >
                    <div className='flex gap-2'>
                      {menu.icon != null && <Icon icon={menu.icon as keyof typeof icons} />}
                      {menu.title}
                    </div>
                    {menu.children !== undefined ? <Icon icon='ChevronDown' /> : null}
                  </Menu>
                  {isParentActive(menu) &&
                    menu.children?.map((child, i) => (
                      <div key={i} className='ml-2'>
                        <Menu
                          to={child.link}
                          isEvaluation={false}
                          className='w-full rounded-md flex items-center gap-2 bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-primary-200 [&.active]:bg-primary-700 [&.active]:cursor-default px-4 py-2'
                        >
                          {child.icon != null && <Icon icon={child.icon as keyof typeof icons} />}
                          {child.title}
                        </Menu>
                      </div>
                    ))}
                </div>
              )
          )}
          <Button fullWidth center={false} onClick={handleLogout}>
            <Icon icon='Logout' />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
