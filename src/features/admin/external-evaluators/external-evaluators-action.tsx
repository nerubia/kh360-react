import { LinkButton } from "../../../components/button/Button"
import { useAppSelector } from "../../../hooks/useAppSelector"

export const ExternalEvaluatorsAction = () => {
  const { totalItems } = useAppSelector((state) => state.externalUsers)

  return (
    <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
      <h2 className='text-gray-400'>
        {totalItems} {totalItems === 1 ? "Result" : "Results"} Found
      </h2>
      <LinkButton to='/admin/external-evaluators/add'>Add External Evaluator</LinkButton>
    </div>
  )
}
