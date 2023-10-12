import { EvaluationList } from "../../features/evaluations/EvaluationList"

export default function Evaluations() {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-lg font-bold'>Evaluation</h1>
      <EvaluationList />
    </div>
  )
}
