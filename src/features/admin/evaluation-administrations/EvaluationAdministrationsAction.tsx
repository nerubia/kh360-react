import { LinkButton } from "../../../components/button/Button"
import { useAppSelector } from "../../../hooks/useAppSelector"

export const EvaluationAdministrationsAction = () => {
  const { evaluation_administrations } = useAppSelector(
    (state) => state.evaluationAdministrations
  )

  return (
    <div className='flex flex-col md:flex-row justify-between gap-4'>
      <h2 className='text-gray-400 text-xl'>
        {evaluation_administrations.length}{" "}
        {evaluation_administrations.length === 1 ? "Result" : "Results"} Found
      </h2>
      <LinkButton to='/admin/evaluation-administrations/create'>
        Create Evaluations
      </LinkButton>
    </div>
  )
}
