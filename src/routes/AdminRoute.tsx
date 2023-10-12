import { Navigate, Outlet } from "react-router-dom"
import { useAdmin } from "../hooks/useAdmin"

export default function AdminRoute() {
  const isAdmin = useAdmin()
  return isAdmin ? <Outlet /> : <Navigate to='/dashboard' />
}
