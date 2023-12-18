import { EvaluationsHeader } from "../../../features/evaluations/[id]/evaluations-header"
import { EvaluationsList } from "../../../features/evaluations/[id]/evaluations-list"
import { EvaluationsCriteria } from "../../../features/evaluations/[id]/evaluations-criteria"
import { Divider } from "../../../components/ui/divider/divider"

export default function Evaluations() {
  return (
    <>
      <EvaluationsHeader />
      <div className='md:h-[calc(100vh_-_180px)] flex flex-col md:flex-row md:w-[95%] shadow-md'>
        <EvaluationsList />
        <Divider orientation='vertical' />
        <EvaluationsCriteria />
      </div>
    </>
  )
}
