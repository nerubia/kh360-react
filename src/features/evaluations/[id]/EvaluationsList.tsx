import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Badge } from "../../../components/badge/Badge"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Button } from "../../../components/button/Button"
import { Icon } from "../../../components/icon/Icon"
import { EvaluationStatus } from "../../../types/evaluationType"
import { getUserEvaluations } from "../../../redux/slices/user-slice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { Loading } from "../../../types/loadingType"
import { getEvaluationStatusVariant } from "../../../utils/variant"
import { type Evaluation } from "../../../types/evaluationType"
import Dialog from "../../../components/dialog/Dialog"

export const EvaluationsList = () => {
  const navigate = useNavigate()
  const { id, evaluation_id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, user_evaluations } = useAppSelector((state) => state.user)
  const { is_editing } = useAppSelector((state) => state.evaluationTemplateContents)
  const [sortedEvaluations, setSortedEvaluations] = useState<Evaluation[]>([])
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<number>()

  useEffect(() => {
    const getEvaluations = async () => {
      if (id !== undefined) {
        const result = await appDispatch(
          getUserEvaluations({
            evaluation_administration_id: parseInt(id),
            for_evaluation: 1,
          })
        )
        if (
          result.type === "user/getUserEvaluations/fulfilled" &&
          result.payload.length > 0 &&
          evaluation_id !== undefined
        ) {
          const finalSortedEvaluations = sortEvaluations(result.payload)
          if (
            finalSortedEvaluations !== undefined &&
            (parseInt(evaluation_id) === finalSortedEvaluations[0].id || evaluation_id === "all")
          ) {
            navigate(
              `/evaluation-administrations/${id}/evaluations/${finalSortedEvaluations[0].id}`
            )
          }
        }
      }
    }
    void getEvaluations()
  }, [id])

  const sortEvaluations = (evaluations: Evaluation[]) => {
    if (evaluations !== undefined && evaluations.length > 0) {
      const newEvaluations = [...evaluations]
      const sortedEvaluations = newEvaluations.sort((a: Evaluation, b: Evaluation) => {
        const aEvaluee = a.evaluee
        const bEvaluee = b.evaluee

        const lastNameComparison = (aEvaluee?.last_name ?? "").localeCompare(
          bEvaluee?.last_name ?? ""
        )

        if (lastNameComparison !== 0) {
          return lastNameComparison
        }
        return (a.evaluator?.first_name ?? "").localeCompare(b.evaluator?.first_name ?? "")
      })

      const submittedEvaluations = sortedEvaluations.filter(
        (evaluation) => evaluation.status === EvaluationStatus.Submitted
      )
      const otherEvaluations = sortedEvaluations.filter(
        (evaluation) => evaluation.status !== EvaluationStatus.Submitted
      )

      const finalSortedEvaluations: Evaluation[] = [...otherEvaluations, ...submittedEvaluations]

      setSortedEvaluations(finalSortedEvaluations)
      return finalSortedEvaluations
    }
  }

  useEffect(() => {
    sortEvaluations(user_evaluations)
  }, [user_evaluations])

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  const handleOnClickEvaluation = (eval_id: number) => {
    toggleDialog()
    setSelectedEvaluationId(eval_id)
  }

  const handleProceed = () => {
    toggleDialog()
    navigate(`/evaluation-administrations/${id}/evaluations/${selectedEvaluationId}`)
  }

  const handleNavigate = (eval_id: number) => {
    navigate(`/evaluation-administrations/${id}/evaluations/${eval_id}`)
    setSelectedEvaluationId(eval_id)
  }

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && user_evaluations === null && <div>Not found</div>}
      {loading === Loading.Fulfilled && user_evaluations.length === 0 && (
        <div>No evaluations available yet.</div>
      )}
      <div className='w-96 flex flex-col overflow-y-scroll'>
        {loading === Loading.Fulfilled &&
          user_evaluations.length > 0 &&
          evaluation_id !== undefined && (
            <>
              {sortedEvaluations.map((evaluation) => (
                <Button
                  key={evaluation.id}
                  variant={`${evaluation.id === parseInt(evaluation_id) ? "primary" : "project"}`}
                  fullWidth
                  center={false}
                  onClick={
                    is_editing
                      ? () => handleOnClickEvaluation(evaluation.id)
                      : () => handleNavigate(evaluation.id)
                  }
                >
                  <div className='flex items-center justify-center w-10 h-10 rounded-full py-2'>
                    {evaluation.evaluee?.picture === undefined ||
                    evaluation.evaluee?.picture === null ? (
                      <Icon icon='UserFill' />
                    ) : (
                      <img
                        className='w-10 h-10 rounded-full'
                        src={evaluation.evaluee?.picture}
                        alt={`Avatar of ${evaluation.evaluee.last_name}, ${evaluation.evaluee.first_name}`}
                      />
                    )}
                  </div>
                  <div
                    className={`flex-1 flex flex-col text-start ${
                      evaluation.status === EvaluationStatus.Open ? "font-bold" : ""
                    }`}
                  >
                    <div className='flex justify-between gap-4'>
                      <p className='text-sm'>
                        {evaluation.evaluee?.last_name}
                        {", "}
                        {evaluation.evaluee?.first_name}
                      </p>
                      <div className='uppercase'>
                        <Badge
                          variant={getEvaluationStatusVariant(evaluation?.status)}
                          size='small'
                        >
                          {evaluation.status}
                        </Badge>
                      </div>
                    </div>
                    <p className='text-xs'>
                      {evaluation.project?.name} [{evaluation.project_role?.short_name}]
                    </p>
                  </div>
                </Button>
              ))}
              <Dialog open={showDialog && is_editing}>
                <Dialog.Title>Confirm Discard Changes</Dialog.Title>
                <Dialog.Description>
                  You have unsaved changes on this page. <br /> Are you sure you want to discard
                  these changes?
                </Dialog.Description>
                <Dialog.Actions>
                  <Button variant='primaryOutline' onClick={toggleDialog}>
                    No
                  </Button>
                  <Button variant='primary' onClick={() => handleProceed()}>
                    Yes
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </>
          )}
      </div>
    </>
  )
}
