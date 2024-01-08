import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ValidationError } from "yup"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { Button, LinkButton } from "../../../../components/ui/button/button"
import { Input } from "../../../../components/ui/input/input"
import { TextArea } from "../../../../components/ui/textarea/text-area"
import { createEvaluationAdministrationSchema } from "../../../../utils/validation/evaluation-administration-schema"
import { Loading } from "../../../../types/loadingType"
import { getDefaultEmailTemplate } from "../../../../redux/slices/email-template-slice"
import Dialog from "../../../../components/ui/dialog/dialog"
import { type EvaluationAdministrationFormData } from "../../../../types/form-data-type"
import { createEvaluationAdministration } from "../../../../redux/slices/evaluation-administrations-slice"
import { setSelectedEmployeeIds } from "../../../../redux/slices/evaluation-administration-slice"
import { setEvaluationResults } from "../../../../redux/slices/evaluation-results-slice"

export const CreateEvaluationForm = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.evaluationAdministrations)
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
      if (result.payload.id !== undefined) {
        appDispatch(setEvaluationResults([]))
        appDispatch(setSelectedEmployeeIds([]))
        navigate(`/admin/evaluation-administrations/${result.payload.id}/select`)
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
          />
        </div>
        <div className='flex flex-col'>
          <h2 className='font-medium'>Evaluation Period</h2>
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <div className='w-full'>
              <Input
                name='eval_period_start_date'
                type='date'
                placeholder='Evaluation period'
                value={formData.eval_period_start_date}
                onChange={handleInputChange}
                error={validationErrors.eval_period_start_date}
                max={formData.eval_period_end_date}
              />
            </div>
            <h2 className='font-medium'>to</h2>
            <div className='w-full'>
              <Input
                name='eval_period_end_date'
                type='date'
                placeholder='Evaluation period'
                value={formData.eval_period_end_date}
                onChange={handleInputChange}
                error={validationErrors.eval_period_end_date}
                min={formData.eval_period_start_date}
                max={formData.eval_schedule_start_date}
              />
            </div>
          </div>
        </div>
        <div>
          <h2 className='font-medium'>Evaluation Schedule</h2>
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <div className='w-full'>
              <Input
                name='eval_schedule_start_date'
                type='date'
                placeholder='Evaluation schedule'
                value={formData.eval_schedule_start_date}
                onChange={handleInputChange}
                min={formData.eval_period_end_date}
                max={formData.eval_schedule_end_date}
                error={validationErrors.eval_schedule_start_date}
              />
            </div>
            <h2 className='font-medium text-center'>to</h2>
            <div className='w-full'>
              <Input
                name='eval_schedule_end_date'
                type='date'
                placeholder='Evaluation schedule'
                value={formData.eval_schedule_end_date}
                onChange={handleInputChange}
                error={validationErrors.eval_schedule_end_date}
                min={formData.eval_schedule_start_date}
              />
            </div>
          </div>
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
        {error != null && <p className='text-red-500'>{error}</p>}
        <div className='flex justify-between'>
          <Button variant='primaryOutline' onClick={toggleDialog}>
            Cancel & Exit
          </Button>
          <Button onClick={handleSubmit} loading={loading === Loading.Pending}>
            Save & Proceed
          </Button>
        </div>
      </div>
      <Dialog open={showDialog}>
        <Dialog.Title>Cancel & Exit</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to cancel and exit? <br />
          If you cancel, your data won&apos;t be saved.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleDialog}>
            No
          </Button>
          <LinkButton variant='primary' to='/admin/evaluation-administrations'>
            Yes
          </LinkButton>
        </Dialog.Actions>
      </Dialog>
    </div>
  )
}
