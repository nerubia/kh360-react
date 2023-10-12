import { EvaluationList } from "../../features/evaluation/EvaluationList"

export default function Evaluation() {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-lg font-bold'>Evaluation</h1>
      <EvaluationList />
    </div>
  )
}
