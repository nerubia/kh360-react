import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { getEvaluationTemplates } from "../../../../../../../redux/slices/evaluation-templates-slice"
import { useAppSelector } from "../../../../../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../../../../../hooks/useAppDispatch"
import { getEvaluationResult } from "../../../../../../../redux/slices/evaluation-result-slice"
import { Menu } from "../../../../../../../components/shared/Menu"

export const EvaluatorsRoles = () => {
  const navigate = useNavigate()
  const { id, evaluation_result_id, evaluation_template_id } = useParams()
  const appDispatch = useAppDispatch()
  const { evaluation_templates } = useAppSelector((state) => state.evaluationTemplates)

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
      evaluation_template_id === "all" &&
      result.payload.length > 0
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
          <Menu
            key={template.id}
            isEvaluation={false}
            to={`/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${template.id}`}
            className='w-full rounded-md flex items-center gap-2 text-black hover:bg-gray-100 active:bg-primary-500 [&.active]:bg-primary-500 [&.active]:text-white [&.active]:cursor-default h-9 text-base px-4'
          >
            {template.display_name}
          </Menu>
        ))}
      </div>
    </div>
  )
}
