import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { useAppSelector } from "../../hooks/useAppSelector"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { setActiveSidebar } from "../../redux/slices/appSlice"
import { Icon } from "../icon/Icon"
import { Sidebar } from "../sidebar/Sidebar"
import { Button } from "../button/Button"

export default function DashboardLayout() {
  const { activeSidebar } = useAppSelector((state) => state.app)
  const appDispatch = useAppDispatch()

  const toggleSidebar = () => {
    appDispatch(setActiveSidebar(!activeSidebar))
  }

  return (
    <div className='flex '>
      <Sidebar />
      <div
        className={`${
          activeSidebar ? "md:ml-64" : ""
        } p-5 transition-all duration-300`}
      >
        <div className='flex flex-col gap-4'>
          <Button variant='ghost' size='small' onClick={toggleSidebar}>
            <Icon icon='Menu' />
          </Button>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
