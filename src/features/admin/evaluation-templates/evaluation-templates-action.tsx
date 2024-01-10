import { useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/button/button"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { setEvaluationTemplate } from "../../../redux/slices/evaluation-template-slice"

export const EvaluationTemplatesAction = () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const { totalItems } = useAppSelector((state) => state.evaluationTemplates)

  const handleAdd = () => {
    void appDispatch(setEvaluationTemplate(null))
    navigate("/admin/evaluation-templates/create")
  }

  return (
    <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
      <h2 className='text-gray-400'>
        {totalItems} {totalItems === 1 ? "Result" : "Results"} Found
      </h2>
      <Button onClick={handleAdd}>Add Evaluation Template</Button>
    </div>
  )
}
