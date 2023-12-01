import { Divider } from "../../components/ui/divider/divider"
import { EvaluationsCriteria } from "../../features/evaluations/[id]/evaluations-criteria"
import { EvaluationsHeader } from "../../features/evaluations/[id]/evaluations-header"
import { EvaluationsList } from "../../features/evaluations/[id]/evaluations-list"
import { ExternalAuthForm } from "../../features/external-evaluations/external-auth-form"
import { useAppSelector } from "../../hooks/useAppSelector"

export default function ExternalEvaluations() {
  const { access_token } = useAppSelector((state) => state.auth)
  return access_token !== null ? (
    <div>
      <EvaluationsHeader />
      <div className='h-[calc(100vh_-_180px)] flex flex-row gap-4 w-5/6 shadow-md'>
        <EvaluationsList />
        <Divider orientation='vertical' />
        <EvaluationsCriteria />
      </div>
    </div>
  ) : (
    <div className='flex justify-center pt-10 p-4'>
      <div className='w-full sm:w-96 flex flex-col p-4 shadow-md'>
        <ExternalAuthForm />
      </div>
    </div>
  )
}
