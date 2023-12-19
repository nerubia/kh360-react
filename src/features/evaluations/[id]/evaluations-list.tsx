import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Button, LinkButton } from "../../../components/ui/button/button"
import { Icon } from "../../../components/ui/icon/icon"
import Image from "../../../components/ui/image/image"
import { EvaluationStatus } from "../../../types/evaluation-type"
import { getUserEvaluations } from "../../../redux/slices/user-slice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { Loading } from "../../../types/loadingType"
import { type Evaluation } from "../../../types/evaluation-type"
import { Menu } from "../../../components/shared/Menu"
import Dialog from "../../../components/ui/dialog/dialog"
import { Badge } from "../../../components/ui/badge/Badge"
import { getEvaluationStatusVariant } from "../../../utils/variant"
import { getByTemplateType } from "../../../redux/slices/email-template-slice"
import { StatusBadge } from "../../../components/ui/badge/StatusBadge"

export const EvaluationsList = () => {
  const navigate = useNavigate()
  const { id, evaluation_id } = useParams()
  const appDispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
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
    if (user?.is_external === true) {
      void appDispatch(getByTemplateType("Evaluation Complete Thank You Message External"))
    } else {
      void appDispatch(getByTemplateType("Evaluation Complete Thank You Message"))
    }
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
      const forRemovalEvaluations = sortedEvaluations.filter(
        (evaluation) => evaluation.status === EvaluationStatus.ForRemoval
      )
      const otherEvaluations = sortedEvaluations.filter(
        (evaluation) =>
          evaluation.status !== EvaluationStatus.Submitted &&
          evaluation.status !== EvaluationStatus.ForRemoval
      )

      const finalSortedEvaluations: Evaluation[] = [
        ...otherEvaluations,
        ...submittedEvaluations,
        ...forRemovalEvaluations,
      ]

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
      <div className='md:w-96 h-45 md:96 md:h-[95%] flex flex-col my-4'>
        <div className='flex px-2 mx-2 mb-4 overflow-x-auto overflow-y-hidden md:flex-1 md:overflow-y-auto md:overflow-x-hidden md:flex-col'>
          {loading === Loading.Fulfilled &&
            user_evaluations.length > 0 &&
            evaluation_id !== undefined && (
              <>
                {sortedEvaluations.map((evaluation) => (
                  <Menu
                    key={evaluation.id}
                    isEvaluation={true}
                    evaluation_id={evaluation_id}
                    evaluation={evaluation}
                    to=''
                    onClick={
                      is_editing
                        ? () => handleOnClickEvaluation(evaluation.id)
                        : () => handleNavigate(evaluation.id)
                    }
                    className='rounded-md flex items-center gap-2 p-2 border md:border-none m-0.5 md:m-0 flex-col md:flex-row relative'
                  >
                    <span className='absolute block rounded md:hidden top-2 right-1'>
                      <StatusBadge
                        variant={getEvaluationStatusVariant(evaluation?.status)}
                        size='medium'
                      >
                        {evaluation.status}
                      </StatusBadge>
                    </span>
                    <div className='flex items-center justify-center w-10 h-10 py-2 bg-gray-100 rounded-full md:bg-transparent'>
                      {evaluation.evaluee?.picture === undefined ||
                      evaluation.evaluee?.picture === null ? (
                        <Icon icon='UserFill' />
                      ) : (
                        <Image
                          altText={`Avatar of ${evaluation.evaluee.last_name}, ${evaluation.evaluee.first_name}`}
                          first_name={evaluation.evaluee.first_name}
                          imageUrl={evaluation.evaluee?.picture}
                          variant={"brokenImage"}
                        />
                      )}
                    </div>
                    <div
                      className={`flex-1 flex flex-col text-start ${
                        evaluation.status === EvaluationStatus.Open ? "font-bold" : ""
                      }`}
                    >
                      <div className='flex flex-col justify-between gap-4 md:flex-row'>
                        <p className='text-sm'>
                          {evaluation.evaluee?.last_name}
                          {", "}
                          {evaluation.evaluee?.first_name}
                        </p>
                        <div className='hidden uppercase md:block'>
                          <Badge
                            variant={getEvaluationStatusVariant(evaluation?.status)}
                            size='small'
                          >
                            {evaluation.status}
                          </Badge>
                        </div>
                      </div>

                      {evaluation.project !== null && (
                        <p className='hidden text-xs md:block'>
                          {evaluation.project?.name} [{evaluation.project_role?.short_name}]
                        </p>
                      )}
                      <p className='hidden text-xs md:block'>{evaluation.template?.display_name}</p>
                    </div>
                  </Menu>
                ))}
                <div className='hidden p-2 md:block'>
                  <LinkButton to='/evaluation-administrations' variant='primaryOutline'>
                    <Icon icon='ChevronLeft' />
                  </LinkButton>
                </div>
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
      </div>
    </>
  )
}
