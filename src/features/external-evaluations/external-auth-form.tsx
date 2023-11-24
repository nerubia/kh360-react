import { useEffect, useState } from "react"
import { type ExternalAuthFormData } from "../../types/formDataType"
import { Input } from "../../components/input/Input"
import { Button } from "../../components/ui/button/button"
import { ValidationError } from "yup"
import { externalAuthSchema } from "../../utils/validation/external-evaluator-schema"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import {
  getExternalUserStatus,
  loginAsExternalUser,
  resendCode,
} from "../../redux/slices/authSlice"
import { useAppSelector } from "../../hooks/useAppSelector"
import { Loading } from "../../types/loadingType"
import { useSearchParams } from "react-router-dom"
import { Spinner } from "../../components/spinner/Spinner"
import { convertToFullDateAndTime } from "../../utils/format-date"
import { addHours } from "date-fns"

export const ExternalAuthForm = () => {
  const appDispatch = useAppDispatch()
  const { loading: submitLoading, error } = useAppSelector((state) => state.auth)
  const [searchParams] = useSearchParams()

  const [loading, setLoading] = useState<boolean>(true)
  const [invalid, setInvalid] = useState<boolean>(false)
  const [lockedAt, setLockedAt] = useState<string | null>(null)
  const [formData, setFormData] = useState<ExternalAuthFormData>({
    token: searchParams.get("token") ?? "",
    code: "",
  })
  const [validationErrors, setValidationErrors] = useState<Partial<ExternalAuthFormData>>({})

  useEffect(() => {
    void getStatus()
  }, [])

  const getStatus = async () => {
    const result = await appDispatch(
      getExternalUserStatus({
        token: searchParams.get("token") ?? "",
      })
    )
    if (result.type === "auth/getExternalUserStatus/fulfilled") {
      setLockedAt(result.payload.locked_at)
    }
    if (result.type === "auth/getExternalUserStatus/rejected") {
      setInvalid(true)
    }
    setLoading(false)
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
      await appDispatch(loginAsExternalUser(formData))
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
          Locked until
          <br />
          {convertToFullDateAndTime(addHours(new Date(lockedAt), 1).toISOString())}
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
            <div className='flex justify-end'>
              <Button
                variant='unstyled'
                size='small'
                onClick={handleResendCode}
                loading={submitLoading === Loading.Pending}
              >
                Resend verification code?
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
