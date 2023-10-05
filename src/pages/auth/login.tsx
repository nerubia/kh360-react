import { LoginForm } from "../../features/auth/login/LoginForm"
import { LoginOptions } from "../../features/auth/login/LoginOptions"

export const Login = () => {
  return (
    <div className='flex justify-center pt-10 p-4'>
      <div className='w-full sm:w-96 flex flex-col p-4 shadow-md'>
        <LoginForm />
        <p className='py-5 text-sm text-center'>OR</p>
        <LoginOptions />
      </div>
    </div>
  )
}
