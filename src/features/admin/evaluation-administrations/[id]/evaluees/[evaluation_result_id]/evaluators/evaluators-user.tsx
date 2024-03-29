import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { useAppSelector } from "@hooks/useAppSelector"
import { getEvaluationResultStatusVariant } from "@utils/variant"
import { Badge } from "@components/ui/badge/badge"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { setUsers } from "@redux/slices/users-slice"
import { setExternalUsers } from "@redux/slices/external-users-slice"
import Image from "@components/ui/image/user-image"

export const EvaluatorsUser = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const callback = searchParams.get("callback")
  const { id, evaluation_result_id, evaluation_template_id } = useParams()

  const appDispatch = useAppDispatch()
  const { evaluation_result, previousId, nextId } = useAppSelector(
    (state) => state.evaluationResult
  )

  const handleAddEvaluator = () => {
    appDispatch(setUsers([]))
    appDispatch(setExternalUsers([]))
    navigate(
      `/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${evaluation_template_id}/add-evaluator`
    )
  }

  return (
    <>
      {evaluation_result !== null && (
        <div className='flex justify-between items-center'>
          <div className='w-80 flex items-center lg:pb-4'>
            <div className='flex items-center justify-center'>
              {callback === null && (
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
              )}
              <div className='flex-1 flex items-center gap-4'>
                {evaluation_result?.users?.picture === undefined ||
                evaluation_result.users?.picture === null ? (
                  <Icon icon='UserFill' color='primary' size='large' />
                ) : (
                  <Image
                    key={evaluation_result.id}
                    altText={`Avatar of ${evaluation_result?.users?.first_name} ${evaluation_result?.users?.first_name}`}
                    first_name={evaluation_result?.users?.first_name}
                    imageUrl={evaluation_result?.users?.picture}
                    variant={"brokenImage"}
                  />
                )}
                <div className='flex-1 flex lg:block gap-3 pb-1'>
                  <p className='font-bold'>
                    {evaluation_result?.users?.last_name}, {evaluation_result?.users?.first_name}
                  </p>
                  <Badge
                    variant={getEvaluationResultStatusVariant(evaluation_result?.status)}
                    size='small'
                  >
                    {evaluation_result?.status}
                  </Badge>
                </div>
              </div>
            </div>
            {callback === null && (
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
            )}
          </div>
          <div className='pb-4 md:pb-0'>
            <Button size='small' variant='ghost' onClick={handleAddEvaluator}>
              <Icon icon='Plus' color='primary' size='small' />
              <p className='text-primary-500 uppercase whitespace-nowrap'>Add Evaluator</p>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
