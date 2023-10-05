import { Button } from "../../components/button/Button"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { logout } from "../../redux/slices/authSlice"
import { getProfile } from "../../services/api"

export const Dashboard = () => {
  const appDispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleGetUserProfile = async () => {
    try {
      const response = await getProfile()
      // eslint-disable-next-line no-console
      console.log(response.data)
    } catch (error) {}
  }

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
        <Button name='Get profile' onClick={handleGetUserProfile} />
        <Button name='Logout' onClick={handleLogout} />
      </div>
    </div>
  )
}
