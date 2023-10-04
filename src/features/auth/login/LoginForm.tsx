import { useState } from "react"
import { Link } from "react-router-dom"
import { ValidationError } from "yup"
import { Input } from "../../../components/input/Input"
import { Button } from "../../../components/button/Button"
import { loginSchema } from "../../../utils/validation/auth/loginSchema"

interface FormData {
  email: string
  password: string
}

export const LoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>(
    {}
  )

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    try {
      await loginSchema.validate(formData, {
        abortEarly: false,
      })
      // eslint-disable-next-line no-console
      console.log(formData)
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<FormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof FormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  return (
    <div className='w-full md:w-96 flex flex-col gap-4 p-4 shadow-md'>
      <h1 className='text-lg font-bold'>Login</h1>
      <Input
        name='email'
        type='email'
        placeholder='Email'
        onChange={handleInputChange}
        error={validationErrors.email}
      />
      <div className='flex flex-col gap-1'>
        <Input
          name='password'
          type='password'
          placeholder='Password'
          onChange={handleInputChange}
          error={validationErrors.password}
        />
        <Link to='/auth/forgot' className='text-sm text-right'>
          Forgot password?
        </Link>
      </div>
      <Button name='Login' onClick={handleSubmit} />
    </div>
  )
}
