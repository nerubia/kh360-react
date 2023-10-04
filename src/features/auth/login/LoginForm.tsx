import { useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "../../../components/input/Input"
import { Button } from "../../../components/button/Button"

export const LoginForm = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log(email, password)
  }

  return (
    <div className='w-full md:w-96 flex flex-col gap-4 p-4 shadow-md'>
      <h1 className='text-lg font-bold'>Login</h1>
      <Input
        type='email'
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className='flex flex-col gap-1'>
        <Input
          type='password'
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to='/auth/forgot' className='text-sm text-right'>
          Forgot password?
        </Link>
      </div>
      <Button name='Login' onClick={handleSubmit} />
    </div>
  )
}
