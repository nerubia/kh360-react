import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Badge } from "../../../components/badge/Badge"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { LinkButton } from "../../../components/button/Button"
import { Icon } from "../../../components/icon/Icon"
import { EvaluationStatus } from "../../../types/evaluationType"
import { getUserEvaluations } from "../../../redux/slices/userSlice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { Loading } from "../../../types/loadingType"
import { getEvaluationStatusVariant } from "../../../utils/variant"
import { type Evaluation } from "../../../types/evaluationType"

export const EvaluationsList = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, user_evaluations } = useAppSelector((state) => state.user)
  const [sortedEvaluations, setSortedEvaluations] = useState<Evaluation[]>([])

  useEffect(() => {
    const getEvaluations = async () => {
      if (id !== undefined) {
        await appDispatch(
          getUserEvaluations({
            evaluation_administration_id: parseInt(id),
            for_evaluation: 1,
          })
        )
      }
    }
    void getEvaluations()
  }, [id])

  useEffect(() => {
    if (user_evaluations !== undefined && user_evaluations.length > 0) {
      const newEvaluations = [...user_evaluations]
      const sortedEvaluations = newEvaluations.sort(
        (a: Evaluation, b: Evaluation) => {
          const aEvaluee = a.evaluee
          const bEvaluee = b.evaluee

          const lastNameComparison = (aEvaluee?.last_name ?? "").localeCompare(
            bEvaluee?.last_name ?? ""
          )

          if (lastNameComparison !== 0) {
            return lastNameComparison
          }
          return (a.evaluator?.first_name ?? "").localeCompare(
            b.evaluator?.first_name ?? ""
          )
        }
      )

      const submittedEvaluations = sortedEvaluations.filter(
        (evaluation) => evaluation.status === EvaluationStatus.Submitted
      )
      const otherEvaluations = sortedEvaluations.filter(
        (evaluation) => evaluation.status !== EvaluationStatus.Submitted
      )

      const finalSortedEvaluations = [
        ...otherEvaluations,
        ...submittedEvaluations,
      ]
      setSortedEvaluations(finalSortedEvaluations)
    }
  }, [user_evaluations])

  useEffect(() => {
    if (sortedEvaluations.length > 0) {
      navigate(
        `/evaluation-administrations/${id}/evaluations/${sortedEvaluations[0].id}`
      )
    }
  }, [sortedEvaluations])

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && user_evaluations === null && (
        <div>Not found</div>
      )}
      {loading === Loading.Fulfilled && user_evaluations.length === 0 && (
        <div>No evaluations available yet.</div>
      )}
      <div className='w-96 flex flex-col gap-4 overflow-y-scroll'>
        {loading === Loading.Fulfilled && user_evaluations.length > 0 && (
          <>
            {sortedEvaluations.map((evaluation) => (
              <LinkButton
                key={evaluation.id}
                variant='project'
                fullWidth
                center={false}
                to={`/evaluation-administrations/${id}/evaluations/${evaluation.id}`}
              >
                <div className='flex items-center justify-center w-10 h-10 rounded-full'>
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
                    evaluation.status === EvaluationStatus.Open
                      ? "font-bold"
                      : ""
                  }`}
                >
                  <div className='flex justify-between gap-4'>
                    <p className='text-sm'>
                      {evaluation.evaluee?.last_name}
                      {", "}
                      {evaluation.evaluee?.first_name}
                    </p>
                    <Badge
                      variant={getEvaluationStatusVariant(evaluation?.status)}
                    >
                      {evaluation.status}
                    </Badge>
                  </div>
                  <p className='text-xs'>
                    {evaluation.project?.name} [
                    {evaluation.project_role?.short_name}]
                  </p>
                </div>
              </LinkButton>
            ))}
          </>
        )}
      </div>
    </>
  )
}
