import { useState, useEffect, useContext } from "react"
import { Icon } from "@components/ui/icon/icon"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { Button } from "@components/ui/button/button"
import { type User } from "@custom-types/user-type"
import {
  getEvaluators,
  getEvaluatorsSocket,
  sendReminder,
} from "@redux/slices/evaluation-administration-slice"
import { updateTotalEvaluations } from "@redux/slices/user-slice"
import {
  getEvaluations,
  approveRequest,
  declineRequest,
  getEvaluationsSocket,
} from "@redux/slices/evaluations-slice"
import { Progress } from "@components/ui/progress/progress"
import { setAlert } from "@redux/slices/app-slice"
import { Badge } from "@components/ui/badge/badge"
import { getEvaluationStatusVariant, getProgressVariant } from "@utils/variant"
import { EvaluationStatus } from "@custom-types/evaluation-type"
import Tooltip from "@components/ui/tooltip/tooltip"
import Dialog from "@components/ui/dialog/dialog"
import { EvaluationAdministrationStatus } from "@custom-types/evaluation-administration-type"
import { convertToFullDateAndTime, shortenFormatDate } from "@utils/format-date"
import { useMobileView } from "@hooks/use-mobile-view"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"

export const EvaluationProgressList = () => {
  const appDispatch = useAppDispatch()
  const { id } = useParams()

  const { user } = useAppSelector((state) => state.auth)
  const { evaluation_administration } = useAppSelector((state) => state.evaluationAdministration)
  const { evaluators } = useAppSelector((state) => state.evaluationAdministration)
  const { evaluations } = useAppSelector((state) => state.evaluations)

  const [sortedEvaluators, setSortedEvaluators] = useState<User[]>(evaluators)
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState<number | null>(null)
  const [selectedEvaluator, setSelectedEvaluator] = useState<User | null>(null)
  const [dispatchedEmployees, setDispatchedEmployees] = useState<number[]>([])
  const [evaluatorToggledState, setEvaluatorToggledState] = useState<boolean[]>([])
  const [showApproveDialog, setShowApproveDialog] = useState<boolean>(false)
  const [showDeclineDialog, setShowDeclineDialog] = useState<boolean>(false)
  const [showEmailLogDialog, setShowEmailLogDialog] = useState<boolean>(false)
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<number | null>(null)

  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  const isMobile = useMobileView()
  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluators(parseInt(id)))
    }
  }, [id])

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluatorsSocket(parseInt(id))).then(() => {
        const toggledEvaluator = sortedEvaluators[evaluatorToggledState.indexOf(true)]
        if (toggledEvaluator !== undefined) {
          void appDispatch(
            getEvaluationsSocket({
              evaluation_administration_id: id,
              for_evaluation: true,
              ...(toggledEvaluator.is_external === true
                ? {
                    external_evaluator_id: toggledEvaluator.id.toString(),
                  }
                : {
                    evaluator_id: toggledEvaluator.id.toString(),
                  }),
            })
          )
        }
      })
    }
  }, [lastJsonMessage])

  useEffect(() => {
    const newEvaluators = [...evaluators]
    const sorted = newEvaluators.sort((a, b) => {
      const firstNameA = (a.first_name ?? "").toLowerCase()
      const lastNameA = (a.last_name ?? "").toLowerCase()
      const firstNameB = (b.first_name ?? "").toLowerCase()
      const lastNameB = (b.last_name ?? "").toLowerCase()

      if (lastNameA !== lastNameB) {
        return lastNameA.localeCompare(lastNameB)
      }

      return firstNameA.localeCompare(firstNameB)
    })
    setSortedEvaluators(sorted)
  }, [evaluators])

  useEffect(() => {
    if (selectedEvaluatorId !== null) {
      setSortedEvaluators((prevResults) =>
        prevResults.map((result) => {
          if (result.id === selectedEvaluatorId) {
            return { ...result, evaluations }
          }
          return result
        })
      )
    }
  }, [evaluations])

  const toggleEvaluator = (index: number, user_id: number, is_external?: boolean) => {
    const updatedToggledState: boolean[] = [...evaluatorToggledState]
    updatedToggledState[index] = !updatedToggledState[index]
    setEvaluatorToggledState(updatedToggledState)
    if (!dispatchedEmployees.includes(index)) {
      if (user_id !== undefined && id !== undefined) {
        void appDispatch(
          getEvaluations({
            evaluation_administration_id: id,
            for_evaluation: true,
            ...(is_external === true
              ? {
                  external_evaluator_id: user_id.toString(),
                }
              : {
                  evaluator_id: user_id.toString(),
                }),
          })
        )
      }
      setDispatchedEmployees((prevDispatchedEmployees) => [...prevDispatchedEmployees, index])
      setSelectedEvaluatorId(user_id)
    }
  }

  const handleOnClickNudge = async (
    evaluator_name: string,
    evaluator_id: number,
    is_external: boolean
  ) => {
    if (id !== undefined) {
      try {
        const result = await appDispatch(
          sendReminder({
            id: parseInt(id),
            user_id: evaluator_id,
            is_external,
          })
        )

        if (result.type === "evaluationAdministration/sendReminder/fulfilled") {
          appDispatch(
            setAlert({
              description: `Reminder successfully sent to ${evaluator_name}!`,
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  const toggleApproveDialog = (id: number | null, evaluator_id: number | null) => {
    setSelectedEvaluationId(id)
    setSelectedEvaluatorId(evaluator_id)
    setShowApproveDialog((prev) => !prev)
  }

  const toggleDeclineDialog = (id: number | null) => {
    setSelectedEvaluationId(id)
    setShowDeclineDialog((prev) => !prev)
  }

  const toggleEmailLogDialog = (evaluator_id: number | null) => {
    setSelectedEvaluator(
      sortedEvaluators.find((evaluator) => evaluator.id === evaluator_id) ?? null
    )
    setShowEmailLogDialog((prev) => !prev)
  }

  const handleApprove = async () => {
    if (selectedEvaluationId !== null && selectedEvaluatorId !== null) {
      try {
        const result = await appDispatch(approveRequest(selectedEvaluationId))
        if (result.type === "evaluations/approveRequest/fulfilled") {
          appDispatch(
            setAlert({
              description: `Request for removal approved!`,
              variant: "success",
            })
          )

          setSortedEvaluators((prevResults) =>
            prevResults.map((evaluator) => {
              if (evaluator.id === selectedEvaluatorId) {
                const updatedEvaluations = evaluator.evaluations?.map((evaluation) => {
                  if (evaluation.id === parseInt(result.payload.id)) {
                    return { ...evaluation, status: result.payload.status }
                  }
                  return evaluation
                })
                if (evaluator.totalEvaluations !== undefined) {
                  const newTotalEvaluations = evaluator.totalEvaluations - 1
                  return {
                    ...evaluator,
                    totalEvaluations: newTotalEvaluations,
                    evaluations: updatedEvaluations,
                  }
                }
              }
              return evaluator
            })
          )
          if (id !== undefined) {
            appDispatch(updateTotalEvaluations({ id }))
          }
        }
      } catch (error) {}
    }
  }

  const handleDecline = async () => {
    if (selectedEvaluationId !== null) {
      try {
        const result = await appDispatch(declineRequest(selectedEvaluationId))

        if (result.type === "evaluations/declineRequest/fulfilled") {
          appDispatch(
            setAlert({
              description: `Request for removal declined!`,
              variant: "success",
            })
          )
          setSortedEvaluators((prevResults) =>
            prevResults.map((evaluator) => {
              if (evaluator.id === selectedEvaluatorId) {
                const updatedEvaluations = evaluator.evaluations?.map((evaluation) => {
                  if (evaluation.id === parseInt(result.payload.id)) {
                    return { ...evaluation, status: result.payload.status }
                  }
                  return evaluation
                })
                return {
                  ...evaluator,
                  evaluations: updatedEvaluations,
                }
              }
              return evaluator
            })
          )
        }
      } catch (error) {}
    }
  }

  const getValue = (totalSubmitted: number, totalEvaluations: number) => {
    if (totalEvaluations !== 0 && totalSubmitted !== 0) {
      return (totalSubmitted / totalEvaluations) * 100
    } else {
      return 0
    }
  }

  return (
    <>
      <div className='flex-1 flex flex-col gap-8 overflow-y-auto h-screen'>
        <div className='flex flex-col'>
          {sortedEvaluators?.map((evaluator, evaluatorIndex) => (
            <div key={evaluatorIndex} className='mb-2'>
              <div className='flex gap-8 mb-2 items-center'>
                <Button
                  onClick={() =>
                    toggleEvaluator(evaluatorIndex, evaluator.id, evaluator.is_external)
                  }
                  variant={"unstyled"}
                >
                  <div className='flex items-center'>
                    <span className='text-xs'>
                      {evaluatorToggledState[evaluatorIndex] ? (
                        <Icon icon='ChevronDown' />
                      ) : (
                        <Icon icon='ChevronRight' />
                      )}
                    </span>
                    <div className='flex flex-row items-center gap-2'>
                      <span className='mx-4 w-48 text-start'>
                        {evaluator.last_name},{" "}
                        {!isMobile &&
                        evaluator.first_name != null &&
                        evaluator.first_name.length > 10 ? (
                          evaluator.first_name
                        ) : (
                          <span className='truncate ...'>{evaluator.first_name}</span>
                        )}
                      </span>
                      <Progress
                        variant={getProgressVariant(
                          getValue(evaluator.totalSubmitted ?? 0, evaluator.totalEvaluations ?? 0)
                        )}
                        value={getValue(
                          evaluator.totalSubmitted ?? 0,
                          evaluator.totalEvaluations ?? 0
                        )}
                        width='w-96'
                      />
                    </div>
                  </div>
                </Button>
                <div className='w-8 text-right'>
                  {Math.round(
                    getValue(evaluator.totalSubmitted ?? 0, evaluator.totalEvaluations ?? 0)
                  )}
                  %
                </div>
                {evaluator.totalEvaluations !== evaluator.totalSubmitted &&
                  evaluation_administration?.status !== EvaluationAdministrationStatus.Closed &&
                  evaluation_administration?.status !== EvaluationAdministrationStatus.Cancelled &&
                  evaluation_administration?.status !==
                    EvaluationAdministrationStatus.Published && (
                    <Tooltip placement='bottomStart'>
                      <Tooltip.Trigger>
                        <Button
                          variant='primaryOutline'
                          size='small'
                          onClick={async () =>
                            await handleOnClickNudge(
                              evaluator.first_name as string,
                              evaluator.id,
                              evaluator.is_external as boolean
                            )
                          }
                        >
                          Nudge
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        {evaluator.email_logs?.length === 0 && <p>No reminders sent.</p>}
                        {evaluator.email_logs !== undefined &&
                          evaluator.email_logs.length > 0 &&
                          evaluator.email_logs.length <= 3 && (
                            <p>
                              {evaluator.email_logs.length}{" "}
                              {evaluator.email_logs.length === 1 ? "reminder" : "reminders"} sent.
                              Reminders sent last:
                            </p>
                          )}
                        {evaluator.email_logs !== undefined && evaluator.email_logs.length > 3 && (
                          <p>
                            {evaluator.email_logs.length} reminders sent. Latest reminders sent
                            last:
                          </p>
                        )}
                        {evaluator.email_logs
                          ?.slice(0, 3)
                          .map((emailLog) => (
                            <p key={emailLog.id}>
                              - {convertToFullDateAndTime(emailLog.sent_at, user)}
                            </p>
                          ))}
                        {evaluator.email_logs !== undefined && evaluator.email_logs.length > 3 && (
                          <Button
                            variant='unstyled'
                            size='small'
                            onClick={() => toggleEmailLogDialog(evaluator.id)}
                          >
                            <span className='text-primary-500 text-xs underline'>View More</span>
                          </Button>
                        )}
                      </Tooltip.Content>
                    </Tooltip>
                  )}
              </div>
              {evaluatorToggledState[evaluatorIndex] && (
                <table className='w-9/10 ml-14 mb-5 table-fixed whitespace-normal'>
                  <thead className='bg-white text-left'>
                    <tr>
                      <th className='pb-3 pr-5 w-270'>Evaluee</th>
                      <th className='pb-3 w-270'>Template</th>
                      <th className='pb-3 w-270'>Project</th>
                      <th className='pb-3 w-270'>Role</th>
                      <th className='pb-3 w-100'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluator.evaluations !== undefined &&
                    evaluator.evaluations !== null &&
                    evaluator.evaluations.length > 0
                      ? evaluator.evaluations.map((evaluation, evaluationIndex) => (
                          <tr key={evaluationIndex}>
                            <td className='py-1 pr-3'>
                              {evaluation.evaluee?.last_name != null &&
                                evaluation.evaluee?.first_name != null &&
                                (evaluation.evaluee.last_name.length +
                                  evaluation.evaluee.first_name.length >
                                30
                                  ? `${
                                      evaluation.evaluee.last_name
                                    }, ${evaluation.evaluee.first_name.slice(
                                      0,
                                      30 - evaluation.evaluee.last_name.length
                                    )}...`
                                  : `${evaluation.evaluee.last_name}, ${evaluation.evaluee.first_name}`)}
                            </td>
                            <td className='py-1 pr-3'>
                              {evaluation.template?.display_name != null &&
                              evaluation.template?.display_name?.length > 30
                                ? `${evaluation.template?.display_name?.slice(
                                    0,
                                    30 - evaluation.template?.display_name.length
                                  )}...`
                                : evaluation.template?.display_name}
                            </td>
                            <td className='py-1 pr-3'>
                              <Tooltip placement='topEnd'>
                                <Tooltip.Trigger>
                                  <div className='flex gap-2 items-center'>
                                    {evaluation.project?.name != null &&
                                    evaluation.project.name.length > 30
                                      ? `${evaluation.project.name.slice(
                                          0,
                                          30 - evaluation.project.name.length
                                        )}...`
                                      : evaluation.project?.name}
                                    {evaluation.project !== null && (
                                      <Icon icon='Calendar' size={"extraSmall"} color={"primary"} />
                                    )}
                                  </div>
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                  <pre className='font-sans whitespace-pre-wrap break-words'>
                                    {shortenFormatDate(evaluation.eval_start_date)} to{" "}
                                    {shortenFormatDate(evaluation.eval_end_date)}
                                  </pre>
                                </Tooltip.Content>
                              </Tooltip>
                            </td>
                            <td className='py-1 pr-3'>
                              {evaluation.project_role?.name != null &&
                              evaluation.project_role?.name.length > 30
                                ? `${evaluation.project_role?.name?.slice(
                                    0,
                                    30 - evaluation.project_role?.name.length
                                  )}...`
                                : evaluation.project_role?.name}
                            </td>
                            <td className='py-1 pr-3 whitespace-nowrap'>
                              {evaluation.status === EvaluationStatus.ForRemoval ? (
                                <Tooltip placement='topEnd'>
                                  <Tooltip.Trigger>
                                    <Badge
                                      variant={getEvaluationStatusVariant(evaluation.status)}
                                      size='small'
                                    >
                                      <div className='uppercase'>{evaluation.status}</div>
                                    </Badge>
                                  </Tooltip.Trigger>
                                  <Tooltip.Content>
                                    <pre className='font-sans whitespace-pre-wrap break-words'>
                                      {evaluation.comments}
                                    </pre>
                                  </Tooltip.Content>
                                </Tooltip>
                              ) : (
                                <Badge
                                  variant={getEvaluationStatusVariant(evaluation.status)}
                                  size='small'
                                >
                                  <div className='uppercase'>{evaluation.status}</div>
                                </Badge>
                              )}
                            </td>
                            {evaluation.status === EvaluationStatus.ForRemoval && (
                              <td className='py-1'>
                                <div className='flex gap-2'>
                                  <Button
                                    variant='textLink'
                                    size='small'
                                    onClick={() =>
                                      toggleApproveDialog(evaluation.id, evaluator?.id)
                                    }
                                  >
                                    Approve
                                  </Button>
                                  <div className='text-slate-300 font-thin'>{" | "}</div>
                                  <Button
                                    variant='textLink'
                                    size='small'
                                    onClick={() => toggleDeclineDialog(evaluation.id)}
                                  >
                                    Decline
                                  </Button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
        <Dialog open={showApproveDialog}>
          <Dialog.Title>Approve Request to Remove</Dialog.Title>
          <Dialog.Description>Are you sure you want to approve this request?</Dialog.Description>
          <Dialog.Actions>
            <Button variant='primaryOutline' onClick={() => toggleApproveDialog(null, null)}>
              No
            </Button>
            <Button
              variant='primary'
              onClick={async () => {
                toggleApproveDialog(null, selectedEvaluatorId)
                await handleApprove()
              }}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog open={showDeclineDialog}>
          <Dialog.Title>Decline Request to Remove</Dialog.Title>
          <Dialog.Description>Are you sure you want to decline this request?</Dialog.Description>
          <Dialog.Actions>
            <Button variant='primaryOutline' onClick={() => toggleDeclineDialog(null)}>
              No
            </Button>
            <Button
              variant='primary'
              onClick={async () => {
                toggleDeclineDialog(null)
                await handleDecline()
              }}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog open={showEmailLogDialog}>
          <Dialog.Title>Email Logs</Dialog.Title>
          <Dialog.Description>
            <p>
              {selectedEvaluator?.email_logs?.length} reminders sent. Latest reminders sent last:
            </p>
            {selectedEvaluator?.email_logs?.map((emailLog) => (
              <p key={emailLog.id}>- {convertToFullDateAndTime(emailLog.sent_at, user)}</p>
            ))}
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant='primary' onClick={() => toggleEmailLogDialog(null)}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </div>
    </>
  )
}
