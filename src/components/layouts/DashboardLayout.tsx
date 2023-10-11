import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <div className='flex '>
      {/* Sidebar */}
      <div className='bg-primary-500 fixed hidden lg:block lg:w-64 h-screen'>
        Sidebar
      </div>

      <div className='ml-0 lg:ml-64'>
        <Outlet />
      </div>
    </div>
  )
}
