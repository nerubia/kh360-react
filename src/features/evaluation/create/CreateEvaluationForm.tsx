import { Button } from "../../../components/button/Button"
import { Input } from "../../../components/input/Input"
import { TextArea } from "../../../components/textarea/TextArea"

export const CreateEvaluationForm = () => {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-lg font-bold'>Evaluation</h1>
      <div className='flex flex-col lg:flex-row gap-4'>
        <div className='flex-1 flex flex-col gap-4'>
          <Input
            label='Evaluation name'
            name='name'
            placeholder='Evaluation name'
            onChange={() => {}}
          />
          <div className='flex flex-col md:items-end md:flex-row gap-4'>
            <Input
              label='Evaluation period'
              name='period_start'
              type='date'
              placeholder='Evaluation period'
              onChange={() => {}}
            />
            <Input
              name='period_end'
              type='date'
              placeholder='Evaluation period'
              onChange={() => {}}
            />
          </div>
          <div className='flex flex-col md:items-end md:flex-row gap-4'>
            <Input
              label='Evaluation schedule'
              name='schedule_start'
              type='date'
              placeholder='Evaluation schedule'
              onChange={() => {}}
            />
            <Input
              name='schedule_end'
              type='date'
              placeholder='Evaluation schedule'
              onChange={() => {}}
            />
          </div>
        </div>
        <div className='flex-1'>
          <TextArea
            label='Evaluation description/notes'
            name='description'
            placeholder='Some description'
            onChange={() => {}}
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
        <Button onClick={() => {}}>Create</Button>
      </div>
    </div>
  )
}
