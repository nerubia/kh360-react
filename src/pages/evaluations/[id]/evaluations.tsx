import { EvaluationsHeader } from "../../../features/evaluations/[id]/EvaluationsHeader"
import { EvaluationsList } from "../../../features/evaluations/[id]/EvaluationsList"
import { EvaluationsCriteria } from "../../../features/evaluations/[id]/EvaluationsCriteria"
import { Divider } from "../../../components/divider/Divider"

export default function Evaluations() {
  return (
    <>
      <EvaluationsHeader />
      <div className='h-[calc(100vh_-_180px)] flex flex-row gap-4 w-5/6 shadow-md'>
        <EvaluationsList />
        <Divider orientation='vertical' />
        <EvaluationsCriteria />
      </div>
    </>
  )
}
