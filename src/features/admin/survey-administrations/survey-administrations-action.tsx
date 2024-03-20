import { LinkButton } from "@components/ui/button/button"
import { useAppSelector } from "@hooks/useAppSelector"

export const SurveyAdministrationsAction = () => {
  const { totalItems } = useAppSelector((state) => state.surveyAdministrations)

  return (
    <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
      <h2 className='text-gray-400'>
        {totalItems} {totalItems === 1 ? "Result" : "Results"} Found
      </h2>
      <LinkButton to='/admin/survey-administrations/create'>Create Survey</LinkButton>
    </div>
  )
}
