import { useAppSelector } from "../../hooks/useAppSelector"
import { useTitle } from "../../hooks/useTitle"

export default function Dashboard() {
  useTitle("Dashboard")

  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-lg font-bold'>Dashboard</h1>
      <p>
        Welcome {user?.firstName} {user?.lastName}
      </p>
    </div>
  )
}
