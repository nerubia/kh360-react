import { useAppSelector } from "../../hooks/useAppSelector"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { setActiveSidebar } from "../../redux/slices/appSlice"
import { Icon } from "../icon/Icon"
import { Button, LinkButton } from "../button/Button"

export const Sidebar = () => {
  const { activeSidebar } = useAppSelector((state) => state.app)
  const { user } = useAppSelector((state) => state.auth)

  const appDispatch = useAppDispatch()

  const toggleSidebar = () => {
    appDispatch(setActiveSidebar(!activeSidebar))
  }

  return (
    <div
      className={`${
        activeSidebar ? "" : "w-64 -ml-64"
      } bg-primary-500 fixed z-10 w-full md:w-64 h-screen transition-all duration-300 $`}
    >
      <div className='relative flex flex-col gap-5 p-5'>
        <div className='block absolute top-5 md:hidden'>
          <Button variant='ghost' onClick={toggleSidebar}>
            <Icon icon='Close' />
          </Button>
        </div>
        <div className='flex justify-center'>
          <img className='h-20' src='/logo.png' />
        </div>
        <h1 className='text-lg text-center font-bold'>
          {user?.firstName} {user?.lastName}
        </h1>
        <div className='flex flex-col gap-2'>
          <LinkButton fullWidth to='/dashboard'>
            Dashboard
          </LinkButton>
          <LinkButton fullWidth to='/sample'>
            Sample
          </LinkButton>
        </div>
      </div>
    </div>
  )
}
