import { Suspense, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { setActiveSidebar } from "@redux/slices/app-slice"
import { Icon } from "@components/ui/icon/icon"
import { Sidebar } from "@components/shared/sidebar/sidebar"
import { Button, LinkButton } from "@components/ui/button/button"
import { Alert } from "@components/ui/alert/alert"
import { useMobileView } from "@hooks/use-mobile-view"
import useSmoothScrollToTop from "@hooks/use-smooth-scroll-to-top"

export default function DashboardLayout() {
  const { activeSidebar, alerts } = useAppSelector((state) => state.app)
  const appDispatch = useAppDispatch()
  const location = useLocation()
  const scrollToTop = useSmoothScrollToTop()

  const toggleSidebar = () => {
    appDispatch(setActiveSidebar(!activeSidebar))
  }
  const isMediumSize = useMobileView(1028)

  useEffect(() => {
    scrollToTop()
  }, [alerts])

  const urlPattern = /^\/evaluation-administrations\/\d+\/evaluations\/\d+$/
  const isButtonVisible = urlPattern.test(location.pathname)

  return (
    <div className='flex overflow-x-hidden'>
      <Sidebar />
      <div
        id='scrollable-div'
        className={`${
          activeSidebar ? (isMediumSize ? "md:ml-44" : "md:ml-64") : ""
        } flex flex-col h-screen w-full transition-all duration-300 overflow-x-hidden`}
      >
        <div className='flex items-center p-5 justify-between'>
          <Button variant='ghost' size='small' onClick={toggleSidebar}>
            <Icon icon='Menu' />
          </Button>
          {isButtonVisible && (
            <div className='block md:hidden'>
              <LinkButton to='/evaluation-administrations' size='small' variant='primaryOutline'>
                <Icon icon='ChevronLeft' size='small' />
              </LinkButton>
            </div>
          )}
        </div>
        {alerts.length > 0 && (
          <div className='p-5'>
            {alerts.map((alert, index) => (
              <div className='m-1' key={index}>
                <Alert key={index} variant={alert.variant} index={index}>
                  {Array.isArray(alert.description)
                    ? alert.description.join("\n")
                    : alert.description}
                </Alert>
              </div>
            ))}
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
