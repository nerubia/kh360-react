import { Button } from "../../components/button/Button"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { logout } from "../../redux/slices/authSlice"

export const Dashboard = () => {
  const appDispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = async () => {
    await appDispatch(logout())
  }

  return (
    <div className='flex flex-col'>
      <h1 className='text-lg font-bold'>Dashboard</h1>
      <p>
        Welcome {user?.firstName} {user?.lastName}
      </p>
      <div>
        <Button name='Logout' onClick={handleLogout} />
      </div>
    </div>
  )
}
