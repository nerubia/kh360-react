import { Suspense } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { setActiveSidebar } from "@redux/slices/app-slice"
import { Icon } from "@components/ui/icon/icon"
import { Sidebar } from "@components/shared/sidebar/sidebar"
import { Button, LinkButton } from "@components/ui/button/button"
import { Alert } from "@components/ui/alert/alert"
import { useMobileView } from "@hooks/use-mobile-view"

export default function DashboardLayout() {
  const { activeSidebar, alertDescription, alertVariant } = useAppSelector((state) => state.app)
  const appDispatch = useAppDispatch()
  const location = useLocation()
  const isMediumSize = useMobileView(1024)
  const toggleSidebar = () => {
    appDispatch(setActiveSidebar(!activeSidebar))
  }

  // Define a regex pattern for the URL format
  const urlPattern = /^\/evaluation-administrations\/\d+\/evaluations\/\d+$/

  // Check if the current URL matches the pattern
  const isButtonVisible = urlPattern.test(location.pathname)

  return (
    <div className='flex overflow-x-hidden'>
      <Sidebar />
      <div
        className={`${
          activeSidebar ? "md:ml-64" : ""
        } flex flex-col h-screen w-full transition-all duration-300 overflow-x-hidden`}
      >
        <div className='lg:h-16 flex items-center px-5 justify-between'>
          <Button variant='ghost' size='small' onClick={toggleSidebar}>
            <Icon size={isMediumSize ? "extraSmall" : "medium"} icon='Menu' />
          </Button>
          {isButtonVisible && (
            <div className='block md:hidden'>
              <LinkButton to='/evaluation-administrations' size='small' variant='primaryOutline'>
                <Icon icon='ChevronLeft' size='small' />
              </LinkButton>
            </div>
          )}
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
