import { Outlet } from "react-router-dom"
import { Icon } from "../icon/Icon"
import { Sidebar } from "../sidebar/Sidebar"
import { useAppSelector } from "../../hooks/useAppSelector"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { setActiveSidebar } from "../../redux/slices/appSlice"

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
          activeSidebar ? "ml-64" : ""
        } p-5 transition-all duration-300`}
      >
        <button onClick={toggleSidebar}>
          <Icon icon='Menu' />
        </button>
        <Outlet />
      </div>
    </div>
  )
}
