import { useParams } from "react-router-dom"
import { LinkButton } from "../../../../../../../components/button/Button"
import { Icon } from "../../../../../../../components/icon/Icon"
import { useAppSelector } from "../../../../../../../hooks/useAppSelector"
import { getEvaluationResultStatusVariant } from "../../../../../../../utils/variant"
import { Badge } from "../../../../../../../components/badge/Badge"

export const EvaluatorsUser = () => {
  const { id } = useParams()

  const { evaluation_result, previousId, nextId } = useAppSelector(
    (state) => state.evaluationResult
  )

  return (
    <div className='w-80 flex items-center pb-4'>
      <div className='w-6'>
        {previousId !== undefined && (
          <LinkButton
            testId='PreviousButton'
            variant='unstyled'
            to={`/admin/evaluation-administrations/${id}/evaluees/${previousId}/evaluators/all`}
          >
            <Icon icon='ChevronLeft' />
          </LinkButton>
        )}
      </div>
      <div className='flex-1 flex items-center gap-4'>
        {evaluation_result?.users?.picture === undefined ||
        evaluation_result.users?.picture === null ? (
          <Icon icon='UserFill' color='primary' size='large' />
        ) : (
          <img
            className='w-10 h-10 rounded-full'
            src={evaluation_result?.users?.picture}
            alt={`Avatar of ${evaluation_result?.users?.first_name} ${evaluation_result?.users?.first_name}`}
          />
        )}
        <div className='flex-1'>
          <p className='font-bold'>
            {evaluation_result?.users?.last_name}, {evaluation_result?.users?.first_name}
          </p>
          <Badge variant={getEvaluationResultStatusVariant(evaluation_result?.status)} size='small'>
            {evaluation_result?.status}
          </Badge>
        </div>
      </div>
      <div className='w-6'>
        {nextId !== undefined && (
          <LinkButton
            testId='NextButton'
            variant='unstyled'
            to={`/admin/evaluation-administrations/${id}/evaluees/${nextId}/evaluators/all`}
          >
            <Icon icon='ChevronRight' />
          </LinkButton>
        )}
      </div>
    </div>
  )
}
