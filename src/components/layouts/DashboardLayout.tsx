import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { useAppSelector } from "../../hooks/useAppSelector"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { setActiveSidebar } from "../../redux/slices/appSlice"
import { Icon } from "../icon/Icon"
import { Sidebar } from "../sidebar/Sidebar"
import { Button } from "../button/Button"
import { Alert } from "../alert/Alert"

export default function DashboardLayout() {
  const { activeSidebar, alertDescription, alertVariant } = useAppSelector(
    (state) => state.app
  )
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
        } w-full transition-all duration-300`}
      >
        <div className='h-16 flex items-center px-5'>
          <Button variant='ghost' size='small' onClick={toggleSidebar}>
            <Icon icon='Menu' />
          </Button>
        </div>
        {alertDescription !== undefined && (
          <div className='p-5'>
            <Alert variant={alertVariant}>{alertDescription}</Alert>
          </div>
        )}
        <div className='p-5'>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
