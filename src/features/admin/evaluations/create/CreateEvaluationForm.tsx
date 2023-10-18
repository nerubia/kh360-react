import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ValidationError } from "yup"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { createEvaluation } from "../../../../redux/slices/evaluationsSlice"
import { type Evaluation } from "../../../../types/evaluationType"
import { Button } from "../../../../components/button/Button"
import { Input } from "../../../../components/input/Input"
import { TextArea } from "../../../../components/textarea/TextArea"
import { createEvaluationSchema } from "../../../../utils/validation/evaluations/createEvaluationSchema"
import { Loading } from "../../../../types/loadingType"
import ModalPopup from "../../../../components/modal/Modal"

export const CreateEvaluationForm = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.evaluations)

  const [formData, setFormData] = useState<Evaluation>({
    name: undefined,
    eval_period_start_date: undefined,
    eval_period_end_date: undefined,
    eval_schedule_start_date: undefined,
    eval_schedule_end_date: undefined,
    email_subject: undefined,
    email_content: undefined,
    remarks: undefined,
  })
  const [validationErrors, setValidationErrors] = useState<Partial<Evaluation>>(
    {}
  )
  const [show_modal, setShowModal] = useState<boolean>(false)

  const handleSubmit = async () => {
    try {
      await createEvaluationSchema.validate(formData, {
        abortEarly: false,
      })
      const result = await appDispatch(createEvaluation(formData))
      if (result.payload.id !== undefined) {
        navigate(`/evaluations/${result.payload.id}/select`)
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

  const handleShowModal = () => {
    setShowModal(true)
  }

  const closePopup = () => {
    setShowModal(false)
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
                  onChange={handleInputChange}
                  error={validationErrors.eval_period_start_date}
                  max={formData.eval_period_end_date}
                />
                <Input
                  label='Period (to)'
                  name='eval_period_end_date'
                  type='date'
                  placeholder='Evaluation period'
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
                  onChange={handleInputChange}
                  max={formData.eval_schedule_end_date}
                  error={validationErrors.eval_schedule_start_date}
                />
                <Input
                  label='Schedule (to)'
                  name='eval_schedule_end_date'
                  type='date'
                  placeholder='Evaluation schedule'
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
          onChange={handleInputChange}
          error={validationErrors.email_subject}
        />
        <TextArea
          name='email_content'
          placeholder='Some description'
          onChange={handleTextAreaChange}
          error={validationErrors.email_content}
        />
      </div>
      <div>
        {error != null && <p className='text-red-500'>{error}</p>}
        <div className='flex justify-between'>
          <Button variant='destructive' onClick={handleShowModal}>
            Cancel & Exit
          </Button>
          <Button onClick={handleSubmit} loading={loading === Loading.Pending}>
            Save & Proceed
          </Button>
        </div>
        <ModalPopup
          show={show_modal}
          title='Cancel & Exit'
          proceed='/admin/evaluations'
          handleClose={closePopup}
        />
      </div>
    </div>
  )
}
