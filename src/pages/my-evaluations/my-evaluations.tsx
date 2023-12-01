import { MyEvaluationsHeader } from "../../features/my-evaluations/my-evaluations-header"
import { MyEvaluationsList } from "../../features/my-evaluations/my-evaluations-list"
import { useTitle } from "../../hooks/useTitle"

export default function MyEvaluations() {
  useTitle("My Evaluations")

  return (
    <div className='flex flex-col gap-8'>
      <MyEvaluationsHeader />
      <MyEvaluationsList />
    </div>
  )
}
