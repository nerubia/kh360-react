import { useNavigate, useParams } from "react-router-dom"
import {
  Button,
  LinkButton,
} from "../../../../../../../components/button/Button"
import { Checkbox } from "../../../../../../../components/checkbox/Checkbox"
import { useAppDispatch } from "../../../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../../../hooks/useAppSelector"
import { useEffect } from "react"
import {
  getEvaluations,
  setForEvaluation,
} from "../../../../../../../redux/slices/evaluationsSlice"
import { formatDate } from "../../../../../../../utils/formatDate"
import { setEvaluationResultStatus } from "../../../../../../../redux/slices/evaluationResultSlice"
import { EvaluationResultStatus } from "../../../../../../../types/evaluationResultType"
import { Loading } from "../../../../../../../types/loadingType"
import { setAlert } from "../../../../../../../redux/slices/appSlice"

export const EvaluatorsList = () => {
  const navigate = useNavigate()
  const { id, evaluation_result_id, evaluation_template_id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.evaluationResult)
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

  const handleClickCheckbox = (evaluationId: number, checked: boolean) => {
    if (evaluationId !== undefined) {
      void appDispatch(
        setForEvaluation({
          id: evaluationId,
          for_evaluation: checked,
        })
      )
    }
  }

  const handleUpdateStatus = async (status: string) => {
    if (evaluation_result_id !== undefined) {
      try {
        const result = await appDispatch(
          setEvaluationResultStatus({
            id: parseInt(evaluation_result_id),
            status,
          })
        )
        if (typeof result.payload === "string") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        } else if (result.payload !== undefined) {
          navigate(`/admin/evaluation-administrations/${id}/evaluees`)
        }
      } catch (error) {}
    }
  }

  return (
    <div className='w-full h-[calc(100vh_-_185px)] flex flex-col pt-4'>
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
                  <Checkbox
                    checked={evaluation.for_evaluation}
                    onChange={(checked) =>
                      handleClickCheckbox(evaluation.id, checked)
                    }
                  />
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
      <div className='flex flex-col md:flex-row justify-between gap-2 pt-5'>
        <LinkButton
          variant='primaryOutline'
          to={`/admin/evaluation-administrations/${id}/evaluees`}
        >
          Back to Employee List
        </LinkButton>
        <div className='flex flex-col md:flex-row items-center gap-2'>
          <Button
            variant='primaryOutline'
            onClick={async () =>
              await handleUpdateStatus(EvaluationResultStatus.Draft)
            }
            loading={loading === Loading.Pending}
          >
            Save as Draft
          </Button>
          <Button
            onClick={async () =>
              await handleUpdateStatus(EvaluationResultStatus.Ready)
            }
            loading={loading === Loading.Pending}
          >
            Mark as Ready
          </Button>
        </div>
      </div>
    </div>
  )
}
