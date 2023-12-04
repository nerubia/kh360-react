import { useState, useEffect } from "react"
import { Icon } from "../../../../../components/ui/icon/icon"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { Button } from "../../../../../components/ui/button/button"
import { type User } from "../../../../../types/user-type"
import {
  getEvaluators,
  sendReminder,
} from "../../../../../redux/slices/evaluation-administration-slice"
import { getEvaluations } from "../../../../../redux/slices/evaluations-slice"
import { Progress } from "../../../../../components/ui/progress/progress"
import { setAlert } from "../../../../../redux/slices/appSlice"
import { Badge } from "../../../../../components/ui/badge/Badge"
import { getEvaluationStatusVariant, getProgressVariant } from "../../../../../utils/variant"

export const EvaluationProgressList = () => {
  const appDispatch = useAppDispatch()
  const { id } = useParams()
  const { evaluators } = useAppSelector((state) => state.evaluationAdministration)
  const { evaluations } = useAppSelector((state) => state.evaluations)

  const [sortedEvaluators, setSortedEvaluators] = useState<User[]>(evaluators)
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState<string>()
  const [dispatchedEmployees, setDispatchedEmployees] = useState<number[]>([])
  const [evaluatorToggledState, setEvaluatorToggledState] = useState<boolean[]>([])

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluators(parseInt(id)))
    }
  }, [id])

  useEffect(() => {
    const newEvaluators = [...evaluators]
    const sorted = newEvaluators.sort((a, b) => {
      const firstNameA = (a.first_name ?? "").toLowerCase()
      const lastNameA = (a.last_name ?? "").toLowerCase()
      const firstNameB = (b.first_name ?? "").toLowerCase()
      const lastNameB = (b.last_name ?? "").toLowerCase()

      if (firstNameA !== firstNameB) {
        return firstNameA.localeCompare(firstNameB)
      }

      return lastNameA.localeCompare(lastNameB)
    })
    setSortedEvaluators(sorted)
  }, [evaluators])

  useEffect(() => {
    if (selectedEvaluatorId !== undefined) {
      setSortedEvaluators((prevResults) =>
        prevResults.map((result) => {
          if (result.id === parseInt(selectedEvaluatorId)) {
            return { ...result, evaluations }
          }
          return result
        })
      )
    }
  }, [evaluations])

  const toggleEvaluator = (index: number, evaluator_id: string | undefined) => {
    const updatedToggledState: boolean[] = [...evaluatorToggledState]
    updatedToggledState[index] = !updatedToggledState[index]
    setEvaluatorToggledState(updatedToggledState)
    if (!dispatchedEmployees.includes(index)) {
      if (evaluator_id !== undefined && id !== undefined) {
        void appDispatch(
          getEvaluations({ evaluation_administration_id: id, evaluator_id, for_evaluation: true })
        )
      }
      setDispatchedEmployees((prevDispatchedEmployees) => [...prevDispatchedEmployees, index])
      setSelectedEvaluatorId(evaluator_id)
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

  return (
    <>
      <div className='flex-1 flex flex-col gap-8 overflow-y-auto overflow-x-hidden h-screen'>
        <div className='flex flex-col'>
          {sortedEvaluators?.map((evaluator, evaluatorIndex) => (
            <div key={evaluatorIndex} className='mb-2'>
              <div className='flex gap-8 mb-2 items-center'>
                <Button
                  onClick={() => toggleEvaluator(evaluatorIndex, evaluator.id?.toString())}
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
                        {evaluator.last_name}, {evaluator.first_name}
                      </span>
                      <Progress
                        variant={getProgressVariant(
                          ((evaluator.totalSubmitted ?? 0) / (evaluator.totalEvaluations ?? 0)) *
                            100
                        )}
                        value={
                          ((evaluator.totalSubmitted ?? 0) / (evaluator.totalEvaluations ?? 0)) *
                          100
                        }
                      />
                    </div>
                  </div>
                </Button>
                {evaluator.totalEvaluations !== evaluator.totalSubmitted && (
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
                )}
              </div>
              {evaluatorToggledState[evaluatorIndex] && (
                <table className='w-1/2 ml-14 mb-5 table-fixed'>
                  <thead className=' bg-white text-left'>
                    <tr>
                      <th className='pb-3'>Evaluee</th>
                      <th className='pb-3'>Project</th>
                      <th className='pb-3'>Role</th>
                      <th className='pb-3'>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluator.evaluations !== undefined &&
                    evaluator.evaluations !== null &&
                    evaluator.evaluations.length > 0
                      ? evaluator.evaluations.map((evaluation, evaluationIndex) => (
                          <tr key={evaluationIndex}>
                            <td className='py-1'>
                              {evaluation.evaluee?.last_name}, {evaluation.evaluee?.first_name}
                            </td>
                            <td className='py-1'>{evaluation.project?.name}</td>
                            <td className='py-1'>{evaluation.project_role?.name}</td>
                            <td className='py-1'>
                              <Badge
                                variant={getEvaluationStatusVariant(evaluation.status)}
                                size='small'
                              >
                                <div className='uppercase'>{evaluation.status}</div>
                              </Badge>
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
