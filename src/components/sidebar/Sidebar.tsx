import { useAppSelector } from "../../hooks/useAppSelector"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAdmin } from "../../hooks/useAdmin"
import { setActiveSidebar } from "../../redux/slices/appSlice"
import { logout } from "../../redux/slices/authSlice"
import { Icon } from "../icon/Icon"
import { Button } from "../button/Button"
import { Menu } from "../../components/shared/Menu"
import { type icons } from "../icon/icons"

export const Sidebar = () => {
  const { activeSidebar } = useAppSelector((state) => state.app)
  const { user } = useAppSelector((state) => state.auth)
  const appDispatch = useAppDispatch()
  const isAdmin = useAdmin()

  const MenuLinks = [
    {
      title: "Sample",
      link: "/sample",
    },
    {
      title: "Dashboard",
      link: "/dashboard",
      icon: "Dashboard",
    },
    {
      title: "Evaluations",
      link: "/evaluation-administrations",
      icon: "Star",
    },
    {
      title: "Evaluation Admin",
      link: "/admin/evaluation-administrations",
      icon: "PenSquare",
    },
    {
      title: "External Evaluators",
      link: "/admin/external-evaluators",
      icon: "UserFill",
    },
  ]

  const toggleSidebar = () => {
    appDispatch(setActiveSidebar(!activeSidebar))
  }

  const handleLogout = async () => {
    await appDispatch(logout())
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
          <img className='h-20' src='/logo.png' />
        </div>
        <h1 className='text-white text-lg text-center font-bold'>
          {user?.first_name} {user?.last_name}
        </h1>
        <div className='flex-1 flex flex-col gap-2'>
          {MenuLinks.map((menu, index) => (
            <Menu
              key={index}
              to={menu.link}
              isEvaluation={false}
              isAdmin={isAdmin}
              className='w-full rounded-md flex items-center gap-2 bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-primary-200 [&.active]:bg-primary-700 [&.active]:cursor-default h-9 text-base px-4'
            >
              {menu.icon != null && <Icon icon={menu.icon as keyof typeof icons} />}
              {menu.title}
            </Menu>
          ))}
          <Button fullWidth center={false} onClick={handleLogout}>
            <Icon icon='Logout' />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
