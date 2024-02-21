import { Suspense, lazy, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ValidationError } from "yup"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button } from "@components/ui/button/button"
import { Input } from "@components/ui/input/input"
import { TextArea } from "@components/ui/textarea/text-area"
import { createEvaluationAdministrationSchema } from "@utils/validation/evaluation-administration-schema"
import { Loading } from "@custom-types/loadingType"
import { getDefaultEmailTemplate } from "@redux/slices/email-template-slice"
import { type EvaluationAdministrationFormData } from "@custom-types/form-data-type"
import { createEvaluationAdministration } from "@redux/slices/evaluation-administrations-slice"
import { setSelectedEmployeeIds } from "@redux/slices/evaluation-administration-slice"
import { setEvaluationResults } from "@redux/slices/evaluation-results-slice"
import { setAlert } from "@redux/slices/app-slice"
import { DateRangePicker } from "@components/ui/date-range-picker/date-range-picker"
import { type DateValueType } from "react-tailwindcss-datepicker"

const EvaluationAdminDialog = lazy(
  async () =>
    await import("@features/admin/evaluation-administrations/evaluation-administrations-dialog")
)

export const CreateEvaluationForm = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.evaluationAdministrations)
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)

  const [formData, setFormData] = useState<EvaluationAdministrationFormData>({
    name: "",
    eval_period_start_date: "",
    eval_period_end_date: "",
    eval_schedule_start_date: "",
    eval_schedule_end_date: "",
    remarks: "",
    email_subject: "",
    email_content: "",
  })
  const [validationErrors, setValidationErrors] = useState<
    Partial<EvaluationAdministrationFormData>
  >({})
  const [showDialog, setShowDialog] = useState<boolean>(false)

  useEffect(() => {
    void appDispatch(getDefaultEmailTemplate())
  }, [])

  useEffect(() => {
    if (emailTemplate !== null) {
      setFormData({
        ...formData,
        email_subject: emailTemplate?.subject,
        email_content: emailTemplate?.content,
      })
    }
  }, [emailTemplate])

  const handleSubmit = async () => {
    try {
      await createEvaluationAdministrationSchema.validate(formData, {
        abortEarly: false,
      })
      const result = await appDispatch(createEvaluationAdministration(formData))
      if (result.type === "evaluationAdministration/createEvaluationAdministration/fulfilled") {
        appDispatch(setEvaluationResults([]))
        appDispatch(setSelectedEmployeeIds([]))
        navigate(`/admin/evaluation-administrations/${result.payload.id}/select`)
      }
      if (result.type === "evaluationAdministration/createEvaluationAdministration/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<EvaluationAdministrationFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof EvaluationAdministrationFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }
  const handleChangeDateRange = (value: DateValueType, field: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field + "_start_date"]: value?.startDate?.toString().split("T")[0] ?? "",
      [field + "_end_date"]: value?.endDate?.toString().split("T")[0] ?? "",
    }))
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTextAreaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }
  const handleRedirect = () => {
    navigate(`/admin/evaluation-administrations`)
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col md:w-1/2 gap-4'>
        <div>
          <h2 className='font-medium'>Evaluation Name</h2>
          <Input
            name='name'
            placeholder='Evaluation name'
            value={formData.name}
            onChange={handleInputChange}
            error={validationErrors.name}
            maxLength={100}
          />
        </div>
        <div className='flex flex-col'>
          <DateRangePicker
            name='evaluation_period'
            label='Evaluation Period'
            value={{
              startDate: formData.eval_period_start_date ?? "",
              endDate: formData.eval_period_end_date ?? "",
            }}
            onChange={(value) => handleChangeDateRange(value, "eval_period")}
          />
        </div>
        <div>
          <DateRangePicker
            name='evaluation_schedule'
            label='Evaluation Schedule'
            value={{
              startDate: formData.eval_schedule_start_date ?? "",
              endDate: formData.eval_schedule_end_date ?? "",
            }}
            onChange={(value) => handleChangeDateRange(value, "eval_schedule")}
          />
        </div>
      </div>
      <TextArea
        label='Description'
        name='remarks'
        placeholder='Some description'
        value={formData.remarks}
        onChange={handleTextAreaChange}
        error={validationErrors.remarks}
      />
      <div className='flex flex-col gap-4'>
        <h1 className='text-lg font-bold'>Email</h1>
        <Input
          label='Subject'
          name='email_subject'
          placeholder='Subject'
          value={formData.email_subject}
          onChange={handleInputChange}
          error={validationErrors.email_subject}
        />
        <TextArea
          label='Content'
          name='email_content'
          placeholder='Email content'
          value={formData.email_content}
          onChange={handleTextAreaChange}
          error={validationErrors.email_content}
        />
      </div>
      <div>
        <div className='flex justify-between'>
          <Button variant='primaryOutline' onClick={toggleDialog}>
            Cancel & Exit
          </Button>
          <Button onClick={handleSubmit} loading={loading === Loading.Pending}>
            Save & Proceed
          </Button>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <EvaluationAdminDialog
          open={showDialog}
          title='Cancel & Exit'
          description={
            <>
              Are you sure you want to cancel and exit? <br />
              If you cancel, your data won&apos;t be saved.
            </>
          }
          onClose={toggleDialog}
          onSubmit={handleRedirect}
          loading={loading === Loading.Pending}
        />
      </Suspense>
    </div>
  )
}
