import { Button } from "../../components/button/Button"
import { Input } from "../../components/input/Input"

export const EvaluationList = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <Input
          name='search'
          type='text'
          placeholder='Search for name'
          onChange={() => {}}
        />
        <Button onClick={() => {}}>Create</Button>
      </div>
      <table className='w-full table-fixed'>
        <thead className='text-left'>
          <tr>
            <th>Name</th>
            <th>Period</th>
            <th>Schedule</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Evaluation 1</td>
            <td>Jan 01 - Jun 01</td>
            <td>Dec 01, 2023</td>
            <td>Actions</td>
          </tr>
          <tr>
            <td>Evaluation 2</td>
            <td>Jan 01 - Jun 01</td>
            <td>Dec 01, 2023</td>
            <td>Actions</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
