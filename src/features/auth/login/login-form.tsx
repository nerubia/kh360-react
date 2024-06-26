import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ValidationError } from "yup"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { login } from "@redux/slices/auth-slice"
import { Input } from "@components/ui/input/input"
import { Button } from "@components/ui/button/button"
import { loginSchema } from "@utils/validation/auth-schema"
import { Loading } from "@custom-types/loadingType"
import { type LoginFormData } from "@custom-types/form-data-type"
import { setCheckedUserSkills, setSelectedUserSkills } from "@redux/slices/user-skills-slice"
import { clearMyEvaluationAdministrations, setUserSkillMapRatings } from "@redux/slices/user-slice"

export const LoginForm = () => {
  const appDispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [validationErrors, setValidationErrors] = useState<Partial<LoginFormData>>({})

  useEffect(() => {
    appDispatch(clearMyEvaluationAdministrations())
    appDispatch(setSelectedUserSkills([]))
    appDispatch(setCheckedUserSkills([]))
    appDispatch(setUserSkillMapRatings([]))
  }, [])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void handleSubmit()
    }
  }

  const handleSubmit = async () => {
    try {
      await loginSchema.validate(formData, {
        abortEarly: false,
      })
      await appDispatch(login(formData))
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<LoginFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof LoginFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-center'>
        <img className='h-32' src='/logo.png' />
      </div>
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
          onKeyDown={handleKeyDown}
          error={validationErrors.password}
        />
        <Link to='/auth/forgot' className='text-sm text-right'>
          Forgot password?
        </Link>
      </div>
      {error != null && <p className='text-red-500'>{error}</p>}
      <Button fullWidth onClick={handleSubmit} loading={loading === Loading.Pending}>
        Login
      </Button>
    </div>
  )
}
