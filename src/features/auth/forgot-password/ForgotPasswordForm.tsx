import { Button } from "../../../components/ui/button/button"
import { Input } from "../../../components/ui/input/input"

export const ForgotPasswordForm = () => {
  return (
    <div className='w-full md:w-96 flex flex-col gap-4 p-4 shadow-md'>
      <h1 className='text-lg font-bold'>Forgot Password</h1>
      <Input name='email' type='email' placeholder='Email' onChange={() => {}} />
      <Button onClick={() => {}}>Send email</Button>
    </div>
  )
}
