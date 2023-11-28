import { EvaluationsHeader } from "../../../features/evaluations/[id]/EvaluationsHeader"
import { EvaluationsList } from "../../../features/evaluations/[id]/EvaluationsList"
import { EvaluationsCriteria } from "../../../features/evaluations/[id]/evaluations-criteria"
import { Divider } from "../../../components/ui/divider/divider"

export default function Evaluations() {
  return (
    <>
      <EvaluationsHeader />
      <div className='h-[calc(100vh_-_180px)] flex flex-col md:flex-row md:w-11/12 shadow-md'>
        <EvaluationsList />
        <Divider orientation='vertical' />
        <EvaluationsCriteria />
      </div>
    </>
  )
}
