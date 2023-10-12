import { Button } from "../../../components/button/Button"
import { Input } from "../../../components/input/Input"
import { TextArea } from "../../../components/textarea/TextArea"

export const CreateEvaluationForm = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-4'>
        <div className='flex-1 flex flex-col gap-4'>
          <Input
            name='name'
            type='text'
            placeholder='Evaluation name'
            onChange={() => {}}
          />
          <div className='flex gap-4'>
            <Input
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
          <div className='flex gap-4'>
            <Input
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
            name='description'
            placeholder='Some description'
            onChange={() => {}}
          />
        </div>
      </div>
      <div className='text-right'>
        <Button onClick={() => {}}>Create</Button>
      </div>
    </div>
  )
}
