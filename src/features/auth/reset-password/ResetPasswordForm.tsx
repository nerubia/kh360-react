import { Button } from "../../../components/button/Button"
import { Input } from "../../../components/input/Input"

export const ResetPasswordForm = () => {
  return (
    <div className='w-full md:w-96 flex flex-col gap-4 p-4 shadow-md'>
      <h1 className='text-lg font-bold'>Reset Password</h1>
      <Input type='password' placeholder='New password' onChange={() => {}} />
      <Input
        type='password'
        placeholder='Confirm new password'
        onChange={() => {}}
      />
      <Button name='Reset' onClick={() => {}} />
    </div>
  )
}
