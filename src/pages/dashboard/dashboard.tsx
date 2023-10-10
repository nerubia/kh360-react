import { Button } from "../../components/button/Button"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { useTitle } from "../../hooks/useTitle"
import { logout } from "../../redux/slices/authSlice"
import { getProfile, sendMail } from "../../services/api"

export default function Dashboard() {
  useTitle("Dashboard")

  const appDispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleGetUserProfile = async () => {
    try {
      const response = await getProfile()
      // eslint-disable-next-line no-console
      console.log(response.data)
    } catch (error) {}
  }

  const handleSendMail = async () => {
    try {
      const response = await sendMail()
      // eslint-disable-next-line no-console
      console.log(response.data)
    } catch (error) {}
  }

  const handleLogout = async () => {
    await appDispatch(logout())
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h1 className='text-lg font-bold'>Dashboard</h1>
      <p>
        Welcome {user?.firstName} {user?.lastName}
      </p>
      <div className='flex gap-2'>
        <Button onClick={handleGetUserProfile}>Get profile</Button>
        <Button onClick={handleSendMail}>Send mail</Button>
        <Button variant='destructive' onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className='flex flex-col gap-4'>
        <p>Sample button variants</p>
        <div className='flex gap-4'>
          <Button size='sm' onClick={() => {}}>
            Small primary
          </Button>
          <Button size='sm' onClick={() => {}} loading={true}>
            Small primary
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button onClick={() => {}}>Medium primary</Button>
          <Button onClick={() => {}} loading={true}>
            Medium primary
          </Button>
        </div>
        <div>
          <Button fullWidth onClick={() => {}}>
            Primary full width
          </Button>
        </div>
        <div>
          <Button fullWidth onClick={() => {}} loading={true}>
            Primary full width
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='primaryOutline' size='sm' onClick={() => {}}>
            Small primary outline
          </Button>
          <Button
            variant='primaryOutline'
            size='sm'
            onClick={() => {}}
            loading={true}
          >
            Small primary outline
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='primaryOutline' onClick={() => {}}>
            Medium primary outline
          </Button>
          <Button variant='primaryOutline' onClick={() => {}} loading={true}>
            Medium primary outline
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='destructive' size='sm' onClick={() => {}}>
            Small danger
          </Button>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => {}}
            loading={true}
          >
            Small danger
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='destructive' onClick={() => {}}>
            Medium danger
          </Button>
          <Button variant='destructive' onClick={() => {}} loading={true}>
            Medium danger
          </Button>
        </div>
        <div>
          <Button variant='destructive' fullWidth onClick={() => {}}>
            Danger full width
          </Button>
        </div>
        <div>
          <Button
            variant='destructive'
            fullWidth
            onClick={() => {}}
            loading={true}
          >
            Danger full width
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='destructiveOutline' size='sm' onClick={() => {}}>
            Small danger outline
          </Button>
          <Button
            variant='destructiveOutline'
            size='sm'
            onClick={() => {}}
            loading={true}
          >
            Small danger outline
          </Button>
        </div>
        <div className='flex gap-4'>
          <Button variant='destructiveOutline' onClick={() => {}}>
            Medium danger outline
          </Button>
          <Button
            variant='destructiveOutline'
            onClick={() => {}}
            loading={true}
          >
            Medium danger outline
          </Button>
        </div>
      </div>
    </div>
  )
}
