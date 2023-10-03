import { Link } from "react-router-dom"
import { Input } from "../../../components/input/Input"
import { Button } from "../../../components/button/Button"

export const LoginForm = () => {
  return (
    <div className='w-full md:w-96 flex flex-col gap-4 p-4 shadow-md'>
      <h1 className='text-lg font-bold'>Login</h1>
      <Input type='email' placeholder='Email' />
      <div className='flex flex-col gap-1'>
        <Input type='password' placeholder='Password' />
        <Link to='/auth/forgot' className='text-sm text-right'>
          Forgot password?
        </Link>
      </div>
      <Button name='Login' />
    </div>
  )
}
