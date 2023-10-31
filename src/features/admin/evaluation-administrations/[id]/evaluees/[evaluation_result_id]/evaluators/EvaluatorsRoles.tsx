import { useNavigate, useParams } from "react-router-dom"
import { LinkButton } from "../../../../../../../components/button/Button"
import { Icon } from "../../../../../../../components/icon/Icon"
import { useEffect } from "react"
import { getEvaluationTemplates } from "../../../../../../../redux/slices/evaluationTemplatesSlice"
import { useAppSelector } from "../../../../../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../../../../../hooks/useAppDispatch"
import { getEvaluationResult } from "../../../../../../../redux/slices/evaluationResultSlice"
import { getEvaluationResultStatusColor } from "../../../../../../../utils/color"

export const EvaluatorsRoles = () => {
  const navigate = useNavigate()
  const { id, evaluation_result_id, evaluation_template_id } = useParams()
  const appDispatch = useAppDispatch()
  const { evaluation_templates } = useAppSelector(
    (state) => state.evaluationTemplates
  )
  const { evaluation_result, previousId, nextId } = useAppSelector(
    (state) => state.evaluationResult
  )

  useEffect(() => {
    if (evaluation_result_id !== undefined) {
      void appDispatch(getEvaluationResult(evaluation_result_id))
    }
    void appDispatch(
      getEvaluationTemplates({
        id,
        evaluation_result_id,
      })
    )
  }, [evaluation_result_id])

  useEffect(() => {
    if (evaluation_template_id === "all" && evaluation_templates.length > 0) {
      navigate(
        `/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${evaluation_templates[0].id}`
      )
    }
  }, [evaluation_templates])

  return (
    <div className='w-96 h-[calc(100vh_-_104px)] flex flex-col gap-4'>
      <div className='flex items-center gap-4 rounded-md'>
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
          <img
            className='w-10 h-10 rounded-full'
            src={evaluation_result?.users?.picture}
            alt={`Avatar of ${evaluation_result?.users?.first_name} ${evaluation_result?.users?.first_name}`}
          />
          <div className='flex-1'>
            <p className='font-bold'>
              {evaluation_result?.users?.last_name},{" "}
              {evaluation_result?.users?.first_name}
            </p>
            <p
              className={getEvaluationResultStatusColor(
                evaluation_result?.status
              )}
            >
              {evaluation_result?.status}
            </p>
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
      <h2 className='text-lg text-center font-bold'>Evaluators Roles</h2>
      <div className='flex-1 flex flex-col gap-2 overflow-y-scroll'>
        {evaluation_templates.map((template) => (
          <LinkButton
            key={template.id}
            variant='project'
            fullWidth
            center={false}
            to={`/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${template.id}`}
          >
            {template.display_name}
          </LinkButton>
        ))}
      </div>
    </div>
  )
}
