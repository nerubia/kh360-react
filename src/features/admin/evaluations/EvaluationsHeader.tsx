import { LinkButton } from "../../../components/button/Button"

export const EvaluationsHeader = () => {
  return (
    <div className='flex flex-col md:flex-row justify-between gap-4'>
      <h1 className='text-2xl font-bold'>Evaluations</h1>
      <LinkButton to='/admin/evaluations/create'>Create Evaluations</LinkButton>
    </div>
  )
}
