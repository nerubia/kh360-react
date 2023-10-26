import { useParams } from "react-router-dom"
import { Button } from "../../../../../../../components/button/Button"
import { Checkbox } from "../../../../../../../components/checkbox/Checkbox"
import { useAppDispatch } from "../../../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../../../hooks/useAppSelector"
import { useEffect } from "react"
import { getEvaluations } from "../../../../../../../redux/slices/evaluationsSlice"
import { formatDate } from "../../../../../../../utils/formatDate"

export const EvaluatorsList = () => {
  const { evaluation_result_id, evaluation_template_id } = useParams()
  const appDispatch = useAppDispatch()
  const { evaluations } = useAppSelector((state) => state.evaluations)

  useEffect(() => {
    if (evaluation_template_id !== "all") {
      void appDispatch(
        getEvaluations({
          evaluation_result_id,
          evaluation_template_id,
        })
      )
    }
  }, [evaluation_template_id])

  return (
    <div className='w-full h-[calc(100vh_-_104px)] flex flex-col'>
      <div className='flex-1 flex-col overflow-y-scroll'>
        <table className='relative w-full'>
          <thead className='sticky top-0 bg-white text-left'>
            <tr>
              <th>Evaluator</th>
              <th>Project</th>
              <th>Evaluee Role</th>
              <th>%</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evaluation) => (
              <tr key={evaluation.id}>
                <td className='flex gap-2'>
                  <Checkbox onChange={() => {}} />
                  {evaluation.evaluator?.last_name},{" "}
                  {evaluation.evaluator?.first_name}
                </td>
                <td>{evaluation.project?.name}</td>
                <td>{evaluation.project_role?.name}</td>
                <td>{evaluation.percent_involvement}%</td>
                <td>
                  {formatDate(evaluation.eval_start_date)} to{" "}
                  {formatDate(evaluation.eval_end_date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-between pt-5'>
        <Button variant='primaryOutline'>Back to Employee List</Button>
        <div className='flex items-center gap-2'>
          <Button variant='primaryOutline'>Save as Draft</Button>
          <Button>Mark as Ready</Button>
        </div>
      </div>
    </div>
  )
}
