import { Outlet } from "react-router-dom"
import { Icon } from "../icon/Icon"
import { useState } from "react"

export default function DashboardLayout() {
  const [activeSidebar, setActiveSidebar] = useState(true)

  return (
    <div className='flex '>
      {/* Sidebar */}
      <div
        className={`${
          activeSidebar ? "" : "-ml-64"
        } bg-primary-500 fixed w-full md:w-64 h-screen p-5`}
      >
        Sidebar
      </div>

      <div className={`${activeSidebar ? "ml-64" : ""} p-5`}>
        <button onClick={() => setActiveSidebar((prev) => !prev)}>
          <Icon icon='Menu' />
        </button>
        <Outlet />
      </div>
    </div>
  )
}
