import { LinkButton } from "@components/ui/button/button"
import { useAppSelector } from "@hooks/useAppSelector"

export const EvaluationAdministrationsAction = () => {
  const { totalItems } = useAppSelector((state) => state.evaluationAdministrations)

  return (
    <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
      <h2 className='text-gray-400'>
        {totalItems} {totalItems === 1 ? "Result" : "Results"} Found
      </h2>
      <LinkButton to='/admin/evaluation-administrations/create'>Create Evaluations</LinkButton>
    </div>
  )
}
