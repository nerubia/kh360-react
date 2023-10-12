import { useState } from "react"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { createEvaluation } from "../../../redux/slices/evaluationsSlice"
import { type Evaluation } from "../../../types/evaluationType"
import { Button } from "../../../components/button/Button"
import { Input } from "../../../components/input/Input"
import { TextArea } from "../../../components/textarea/TextArea"

export const CreateEvaluationForm = () => {
  const appDispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.evaluations)

  const [formData, setFormData] = useState<Evaluation>({
    name: undefined,
    eval_period_start_date: undefined,
    eval_period_end_date: undefined,
    eval_schedule_start_date: undefined,
    eval_schedule_end_date: undefined,
    remarks: undefined,
  })

  const handleSubmit = async () => {
    // TODO: validate
    await appDispatch(createEvaluation(formData))
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
    <div className='flex flex-col gap-4'>
      <h1 className='text-lg font-bold'>Evaluation</h1>
      <div className='flex flex-col lg:flex-row gap-4'>
        <div className='flex-1 flex flex-col gap-4'>
          <Input
            label='Evaluation name'
            name='name'
            placeholder='Evaluation name'
            onChange={handleInputChange}
          />
          <div className='flex flex-col md:items-end md:flex-row gap-4'>
            <Input
              label='Evaluation period'
              name='period_start'
              type='date'
              placeholder='Evaluation period'
              onChange={handleInputChange}
            />
            <Input
              name='period_end'
              type='date'
              placeholder='Evaluation period'
              onChange={handleInputChange}
            />
          </div>
          <div className='flex flex-col md:items-end md:flex-row gap-4'>
            <Input
              label='Evaluation schedule'
              name='schedule_start'
              type='date'
              placeholder='Evaluation schedule'
              onChange={handleInputChange}
            />
            <Input
              name='schedule_end'
              type='date'
              placeholder='Evaluation schedule'
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='flex-1'>
          <TextArea
            label='Evaluation description/notes'
            name='description'
            placeholder='Some description'
            onChange={handleTextAreaChange}
          />
        </div>
      </div>
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
      <div className='text-right'>
        <Button onClick={handleSubmit} loading={loading}>
          Create
        </Button>
      </div>
    </div>
  )
}
