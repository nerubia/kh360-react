import { useEffect, useState } from "react"
import { type ExternalAuthFormData } from "../../types/form-data-type"
import { Input } from "../../components/ui/input/input"
import { Button } from "../../components/ui/button/button"
import { ValidationError } from "yup"
import { externalAuthSchema } from "../../utils/validation/external-evaluator-schema"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import {
  getExternalUserStatus,
  loginAsExternalUser,
  resendCode,
} from "../../redux/slices/auth-slice"
import { useAppSelector } from "../../hooks/useAppSelector"
import { Loading } from "../../types/loadingType"
import { useSearchParams } from "react-router-dom"
import { Spinner } from "../../components/ui/spinner/spinner"
import { addHours, differenceInMinutes, differenceInSeconds } from "date-fns"

export const ExternalAuthForm = () => {
  const appDispatch = useAppDispatch()
  const { loading: submitLoading, error } = useAppSelector((state) => state.auth)
  const [searchParams] = useSearchParams()

  const [loading, setLoading] = useState<boolean>(true)
  const [invalid, setInvalid] = useState<boolean>(false)
  const [lockedAt, setLockedAt] = useState<Date | null>(null)
  const [formData, setFormData] = useState<ExternalAuthFormData>({
    token: searchParams.get("token") ?? "",
    code: "",
  })
  const [validationErrors, setValidationErrors] = useState<Partial<ExternalAuthFormData>>({})

  const [remainingTime, setRemainingTime] = useState("")

  useEffect(() => {
    void getStatus()
  }, [])

  useEffect(() => {
    if (lockedAt !== null) {
      const intervalId = setInterval(() => {
        void calculateRemainingTime()
      }, 1000)
      return () => clearInterval(intervalId)
    }
  }, [lockedAt])

  const getStatus = async () => {
    const result = await appDispatch(
      getExternalUserStatus({
        token: searchParams.get("token") ?? "",
      })
    )
    if (result.type === "auth/getExternalUserStatus/fulfilled") {
      if (result.payload.locked_at === null) {
        setLockedAt(null)
      }
      if (result.payload.locked_at !== null) {
        setLockedAt(addHours(new Date(result.payload.locked_at), 1))
      }
    }
    if (result.type === "auth/getExternalUserStatus/rejected") {
      setInvalid(true)
    }
    setLoading(false)
  }

  const calculateRemainingTime = async () => {
    if (lockedAt !== null) {
      const currentTime = new Date()
      const minutes = differenceInMinutes(lockedAt, currentTime)
      const seconds = differenceInSeconds(lockedAt, currentTime) % 60
      if (minutes <= 0 && seconds <= 0) {
        void getStatus()
        return
      }
      setRemainingTime(`${minutes} minutes and ${seconds} seconds`)
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleResendCode = async () => {
    void appDispatch(
      resendCode({
        token: searchParams.get("token") ?? "",
      })
    )
  }

  const handleSubmit = async () => {
    try {
      await externalAuthSchema.validate(formData, {
        abortEarly: false,
      })
      const result = await appDispatch(loginAsExternalUser(formData))
      if (result.type === "auth/loginAsExternalUser/rejected") {
        void getStatus()
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<ExternalAuthFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof ExternalAuthFormData] = err.message
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
      {loading && <Spinner />}
      {!loading && invalid && <div>Invalid link</div>}
      {!loading && !invalid && lockedAt !== null && (
        <div>
          Your access has been locked due to failed login attempts. Please try again in{" "}
          {remainingTime}.
        </div>
      )}
      {!loading && !invalid && lockedAt === null && (
        <>
          <div className='flex flex-col gap-1'>
            <Input
              name='code'
              type='text'
              placeholder='Code'
              onChange={handleInputChange}
              error={validationErrors.code}
            />
            <div className='flex justify-center'>
              <Button
                variant='unstyled'
                size='small'
                onClick={handleResendCode}
                loading={submitLoading === Loading.Pending}
              >
                <span className='text-primary-500 underline'>Resend verification code?</span>
              </Button>
            </div>
          </div>
          {error != null && <p className='text-red-500'>{error}</p>}
          <Button fullWidth onClick={handleSubmit} loading={submitLoading === Loading.Pending}>
            Continue
          </Button>
        </>
      )}
    </div>
  )
}
