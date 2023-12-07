import { Navigate, Outlet } from "react-router-dom"
import { useInternalUser } from "../hooks/use-internal-user"

export default function InternalUserRoute() {
  const isInternalUser = useInternalUser()
  return isInternalUser ? <Outlet /> : <Navigate to='/evaluation-administrations' />
}
