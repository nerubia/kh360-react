import { useAppSelector } from "../../hooks/useAppSelector"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { setActiveSidebar } from "../../redux/slices/appSlice"
import { Icon } from "../icon/Icon"
import { LinkButton } from "../button/Button"

export const Sidebar = () => {
  const { activeSidebar } = useAppSelector((state) => state.app)

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
      <div className='flex flex-col gap-5 p-5'>
        <button className='block md:hidden' onClick={toggleSidebar}>
          <Icon icon='Menu' />
        </button>
        <div className='flex justify-center'>
          <img className='h-20' src='/logo.png' />
        </div>
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
