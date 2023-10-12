import { useState } from "react"
import { ValidationError } from "yup"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { createEvaluation } from "../../../redux/slices/evaluationsSlice"
import { type Evaluation } from "../../../types/evaluationType"
import { Button } from "../../../components/button/Button"
import { Input } from "../../../components/input/Input"
import { TextArea } from "../../../components/textarea/TextArea"
import { createEvaluationSchema } from "../../../utils/validation/evaluations/createEvaluationSchema"

export const CreateEvaluationForm = () => {
  const appDispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.evaluations)

  const [formData, setFormData] = useState<Evaluation>({
    name: undefined,
    eval_period_start_date: undefined,
    eval_period_end_date: undefined,
    eval_schedule_start_date: undefined,
    eval_schedule_end_date: undefined,
    remarks: undefined,
  })
  const [validationErrors, setValidationErrors] = useState<Partial<Evaluation>>(
    {}
  )

  const handleSubmit = async () => {
    try {
      await createEvaluationSchema.validate(formData, {
        abortEarly: false,
      })
      await appDispatch(createEvaluation(formData))
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
                />
                <Input
                  label='Period (to)'
                  name='eval_period_end_date'
                  type='date'
                  placeholder='Evaluation period'
                  onChange={handleInputChange}
                  error={validationErrors.eval_period_end_date}
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
                  error={validationErrors.eval_schedule_start_date}
                />
                <Input
                  label='Schedule (to)'
                  name='eval_schedule_end_date'
                  type='date'
                  placeholder='Evaluation schedule'
                  onChange={handleInputChange}
                  error={validationErrors.eval_schedule_end_date}
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
          onChange={() => {}}
        />
        <TextArea
          name='email_content'
          placeholder='Some description'
          onChange={() => {}}
        />
      </div>
      <div>
        {error != null && <p className='text-red-500'>{error}</p>}
        <div className='text-right'>
          <Button onClick={handleSubmit} loading={loading}>
            Create
          </Button>
        </div>
      </div>
    </div>
  )
}
