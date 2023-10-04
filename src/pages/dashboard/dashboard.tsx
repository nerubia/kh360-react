import { useAppSelector } from "../../hooks/useAppSelector"

export const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className='flex flex-col'>
      <h1 className='text-lg font-bold'>Dashboard</h1>
      <p>
        Welcome {user?.firstName} {user?.lastName}
      </p>
    </div>
  )
}
