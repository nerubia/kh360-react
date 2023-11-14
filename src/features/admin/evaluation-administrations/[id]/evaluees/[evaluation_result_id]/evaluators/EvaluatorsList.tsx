import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Button,
  LinkButton,
} from "../../../../../../../components/button/Button"
import { Checkbox } from "../../../../../../../components/checkbox/Checkbox"
import { useAppDispatch } from "../../../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../../../hooks/useAppSelector"
import {
  getEvaluations,
  setForEvaluations,
} from "../../../../../../../redux/slices/evaluationsSlice"
import { formatDate } from "../../../../../../../utils/formatDate"
import { setEvaluationResultStatus } from "../../../../../../../redux/slices/evaluationResultSlice"
import { EvaluationResultStatus } from "../../../../../../../types/evaluation-result-type"
import { Loading } from "../../../../../../../types/loadingType"
import { setAlert } from "../../../../../../../redux/slices/appSlice"
import { type Evaluation } from "../../../../../../../types/evaluationType"

export const EvaluatorsList = () => {
  const navigate = useNavigate()
  const { id, evaluation_result_id, evaluation_template_id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.evaluationResult)
  const { evaluations } = useAppSelector((state) => state.evaluations)
  const [sortedEvaluations, setSortedEvaluations] = useState<Evaluation[]>([])

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

  useEffect(() => {
    const newEvaluations = [...evaluations]
    const sorted = newEvaluations.sort((a: Evaluation, b: Evaluation) => {
      const projectComparison = (a.project?.name ?? "").localeCompare(
        b.project?.name ?? ""
      )
      if (projectComparison !== 0) {
        return projectComparison
      }
      const lastNameComparison = (a.evaluator?.last_name ?? "").localeCompare(
        b.evaluator?.last_name ?? ""
      )
      if (lastNameComparison !== 0) {
        return lastNameComparison
      }
      return (a.evaluator?.first_name ?? "").localeCompare(
        b.evaluator?.first_name ?? ""
      )
    })
    setSortedEvaluations(sorted)
  }, [evaluations])

  const handleSelectAll = (checked: boolean) => {
    void appDispatch(
      setForEvaluations({
        evaluation_ids: sortedEvaluations.map((evaluation) => evaluation.id),
        for_evaluation: checked,
      })
    )
  }

  const handleClickCheckbox = (evaluationId: number, checked: boolean) => {
    if (evaluationId !== undefined) {
      void appDispatch(
        setForEvaluations({
          evaluation_ids: [evaluationId],
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
    <div className='flex-1 h-[calc(100vh_-_185px)] flex flex-col pt-4'>
      <div className='flex-1 flex-col overflow-y-scroll'>
        <table className='relative w-full'>
          <thead className='sticky top-0 bg-white text-left'>
            <tr>
              <th className='pb-3'>
                <Checkbox
                  checked={sortedEvaluations.every(
                    (evaluation) => evaluation.for_evaluation
                  )}
                  onChange={(checked) => handleSelectAll(checked)}
                />
              </th>
              <th className='pb-3'>Evaluator</th>
              <th className='pb-3'>Project</th>
              <th className='pb-3'>Evaluee Role</th>
              <th className='pb-3'>%</th>
              <th className='pb-3'>Duration</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvaluations.map((evaluation) => (
              <tr key={evaluation.id}>
                <td className='pb-2'>
                  <Checkbox
                    checked={evaluation.for_evaluation}
                    onChange={(checked) =>
                      handleClickCheckbox(evaluation.id, checked)
                    }
                  />
                </td>
                <td className='pb-2'>
                  {evaluation.evaluator?.last_name},{" "}
                  {evaluation.evaluator?.first_name}
                </td>
                <td className='pb-2'>{evaluation.project?.name}</td>
                <td className='pb-2'>{evaluation.project_role?.name}</td>
                <td className='pb-2'>{evaluation.percent_involvement}%</td>
                <td className='pb-2'>
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
