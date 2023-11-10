import { useNavigate, useParams } from "react-router-dom"
import { LinkButton } from "../../../../../../../components/button/Button"
import { useEffect } from "react"
import { getEvaluationTemplates } from "../../../../../../../redux/slices/evaluationTemplatesSlice"
import { useAppSelector } from "../../../../../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../../../../../hooks/useAppDispatch"
import { getEvaluationResult } from "../../../../../../../redux/slices/evaluationResultSlice"

export const EvaluatorsRoles = () => {
  const navigate = useNavigate()
  const { id, evaluation_result_id, evaluation_template_id } = useParams()
  const appDispatch = useAppDispatch()
  const { evaluation_templates } = useAppSelector(
    (state) => state.evaluationTemplates
  )

  useEffect(() => {
    if (evaluation_result_id !== undefined) {
      void appDispatch(getEvaluationResult(parseInt(evaluation_result_id)))
    }
    void getTemplates()
  }, [evaluation_result_id])

  const getTemplates = async () => {
    const result = await appDispatch(
      getEvaluationTemplates({
        evaluation_result_id,
      })
    )
    if (
      result.type === "evaluationTemplate/getEvaluationTemplates/fulfilled" &&
      evaluation_template_id === "all"
    ) {
      navigate(
        `/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${result.payload[0].id}`
      )
    }
  }

  return (
    <div className='w-80 h-[calc(100vh_-_185px)] pt-4'>
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
