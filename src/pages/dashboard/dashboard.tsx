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
        <Button name='Get profile' onClick={handleGetUserProfile} />
        <Button name='Send mail' onClick={handleSendMail} />
        <Button name='Logout' variant='destructive' onClick={handleLogout} />
      </div>
      <div className='flex flex-col gap-4'>
        <p>Sample button variants</p>
        <div className='flex gap-4'>
          <Button name='Small primary' size='sm' onClick={() => {}} />
          <Button
            name='Small primary'
            size='sm'
            onClick={() => {}}
            loading={true}
          />
        </div>
        <div className='flex gap-4'>
          <Button name='Medium primary' onClick={() => {}} />
          <Button name='Medium primary' onClick={() => {}} loading={true} />
        </div>
        <div>
          <Button name='Primary full width' fullWidth onClick={() => {}} />
        </div>
        <div>
          <Button
            name='Primary full width'
            fullWidth
            onClick={() => {}}
            loading={true}
          />
        </div>
        <div className='flex gap-4'>
          <Button
            name='Small primary outline'
            variant='primaryOutline'
            size='sm'
            onClick={() => {}}
          />
          <Button
            name='Small primary outline'
            variant='primaryOutline'
            size='sm'
            onClick={() => {}}
            loading={true}
          />
        </div>
        <div className='flex gap-4'>
          <Button
            name='Medium primary outline'
            variant='primaryOutline'
            onClick={() => {}}
          />
          <Button
            name='Medium primary outline'
            variant='primaryOutline'
            onClick={() => {}}
            loading={true}
          />
        </div>
        <div className='flex gap-4'>
          <Button
            name='Small danger'
            variant='destructive'
            size='sm'
            onClick={() => {}}
          />
          <Button
            name='Small danger'
            variant='destructive'
            size='sm'
            onClick={() => {}}
            loading={true}
          />
        </div>
        <div className='flex gap-4'>
          <Button
            name='Medium danger'
            variant='destructive'
            onClick={() => {}}
          />
          <Button
            name='Medium danger'
            variant='destructive'
            onClick={() => {}}
            loading={true}
          />
        </div>
        <div>
          <Button
            name='Danger full width'
            variant='destructive'
            fullWidth
            onClick={() => {}}
          />
        </div>
        <div>
          <Button
            name='Danger full width'
            variant='destructive'
            fullWidth
            onClick={() => {}}
            loading={true}
          />
        </div>
        <div className='flex gap-4'>
          <Button
            name='Small danger outline'
            variant='destructiveOutline'
            size='sm'
            onClick={() => {}}
          />
          <Button
            name='Small danger outline'
            variant='destructiveOutline'
            size='sm'
            onClick={() => {}}
            loading={true}
          />
        </div>
        <div className='flex gap-4'>
          <Button
            name='Medium danger outline'
            variant='destructiveOutline'
            onClick={() => {}}
          />
          <Button
            name='Medium danger outline'
            variant='destructiveOutline'
            onClick={() => {}}
            loading={true}
          />
        </div>
      </div>
    </div>
  )
}
