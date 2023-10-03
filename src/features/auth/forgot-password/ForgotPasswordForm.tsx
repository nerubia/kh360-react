import { Button } from "../../../components/button/Button"
import { Input } from "../../../components/input/Input"

export const ForgotPasswordForm = () => {
  return (
    <div className='w-full md:w-96 flex flex-col gap-4 p-4 shadow-md'>
      <h1 className='text-lg font-bold'>Forgot Password</h1>
      <Input type='email' placeholder='Email' />
      <Button name='Send email' />
    </div>
  )
}
