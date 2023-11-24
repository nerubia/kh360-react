import { Button } from "../../../components/ui/button/button"
import { Input } from "../../../components/input/Input"

export const ResetPasswordForm = () => {
  return (
    <div className='w-full md:w-96 flex flex-col gap-4 p-4 shadow-md'>
      <h1 className='text-lg font-bold'>Reset Password</h1>
      <Input name='new_password' type='password' placeholder='New password' onChange={() => {}} />
      <Input
        name='confirm_new_password'
        type='password'
        placeholder='Confirm new password'
        onChange={() => {}}
      />
      <Button onClick={() => {}}>Reset</Button>
    </div>
  )
}
