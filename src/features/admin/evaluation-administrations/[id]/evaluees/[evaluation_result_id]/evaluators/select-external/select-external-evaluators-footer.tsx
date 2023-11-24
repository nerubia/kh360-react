import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../../../../../../../../components/ui/button/button"
import { useAppDispatch } from "../../../../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../../../../hooks/useAppSelector"
import { addExternalEvaluators } from "../../../../../../../../redux/slices/evaluation-administration-slice"
import { setAlert } from "../../../../../../../../redux/slices/appSlice"

export const SelectExternalEvaluatorsFooter = () => {
  const { id, evaluation_result_id, evaluation_template_id } = useParams()
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { selectedExternalUserIds } = useAppSelector((state) => state.evaluationAdministration)
  const { evaluations } = useAppSelector((state) => state.evaluations)
  const callback = `/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${evaluation_template_id}`

  const handleCancel = () => {
    navigate(callback)
  }

  const handleAdd = async () => {
    if (selectedExternalUserIds.length === 0) {
      appDispatch(
        setAlert({
          description: "Please select at least one external evaluator.",
          variant: "destructive",
        })
      )
      return
    }
    if (
      id !== undefined &&
      evaluation_template_id !== undefined &&
      evaluation_result_id !== undefined &&
      evaluations[0].evaluee?.id !== undefined
    ) {
      try {
        const result = await appDispatch(
          addExternalEvaluators({
            id: parseInt(id),
            evaluation_template_id: parseInt(evaluation_template_id),
            evaluation_result_id: parseInt(evaluation_result_id),
            evaluee_id: evaluations[0].evaluee?.id,
            external_user_ids: selectedExternalUserIds,
          })
        )
        if (result.payload.id !== undefined) {
          navigate(callback)
        }
      } catch (error) {}
    }
  }

  return (
    <>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={handleCancel}>
          Cancel
        </Button>
        <div className='flex items-center gap-2'>
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </div>
    </>
  )
}
