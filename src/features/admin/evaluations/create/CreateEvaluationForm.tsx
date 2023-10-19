import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ValidationError } from "yup"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { createEvaluation } from "../../../../redux/slices/evaluationsSlice"
import { type Evaluation } from "../../../../types/evaluationType"
import { Button, LinkButton } from "../../../../components/button/Button"
import { Input } from "../../../../components/input/Input"
import { TextArea } from "../../../../components/textarea/TextArea"
import { createEvaluationSchema } from "../../../../utils/validation/evaluations/createEvaluationSchema"
import { Loading } from "../../../../types/loadingType"
import { getDefaultEmailTemplate } from "../../../../redux/slices/emailTemplateSlice"
import Dialog from "../../../../components/dialog/Dialog"

export const CreateEvaluationForm = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.evaluations)
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)

  const [formData, setFormData] = useState<Evaluation>({
    name: "",
    eval_period_start_date: "",
    eval_period_end_date: "",
    eval_schedule_start_date: "",
    eval_schedule_end_date: "",
    remarks: "",
    email_subject: "",
    email_content: "",
  })
  const [validationErrors, setValidationErrors] = useState<Partial<Evaluation>>(
    {}
  )
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
      await createEvaluationSchema.validate(formData, {
        abortEarly: false,
      })
      const result = await appDispatch(createEvaluation(formData))
      if (result.payload.id !== undefined) {
        navigate(`/admin/evaluations/${result.payload.id}/select`)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<Evaluation> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof Evaluation] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTextAreaChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <div>
            <h1 className='text-lg font-bold'>Evaluation Name</h1>
            <Input
              label='Evaluation name'
              name='name'
              placeholder='Evaluation name'
              value={formData.name}
              onChange={handleInputChange}
              error={validationErrors.name}
            />
          </div>
          <div className='flex flex-col gap-4'>
            <div>
              <h1 className='text-lg font-bold'>Evaluation Period</h1>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <Input
                  label='Period (from)'
                  name='eval_period_start_date'
                  type='date'
                  placeholder='Evaluation period'
                  value={formData.eval_period_start_date}
                  onChange={handleInputChange}
                  error={validationErrors.eval_period_start_date}
                  max={formData.eval_period_end_date}
                />
                <Input
                  label='Period (to)'
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
            <div>
              <h1 className='text-lg font-bold'>Evaluation Schedule</h1>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <Input
                  label='Schedule (from)'
                  name='eval_schedule_start_date'
                  type='date'
                  placeholder='Evaluation schedule'
                  value={formData.eval_schedule_start_date}
                  onChange={handleInputChange}
                  min={formData.eval_period_end_date}
                  max={formData.eval_schedule_end_date}
                  error={validationErrors.eval_schedule_start_date}
                />
                <Input
                  label='Schedule (to)'
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
          label='Evaluation description/notes'
          name='remarks'
          placeholder='Some description'
          value={formData.remarks}
          onChange={handleTextAreaChange}
          error={validationErrors.remarks}
        />
      </div>
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
          name='email_content'
          placeholder='Some description'
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
          <LinkButton variant='primary' to='/admin/evaluations'>
            Yes
          </LinkButton>
        </Dialog.Actions>
      </Dialog>
    </div>
  )
}
