import { useEffect } from "react"
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

export const EvaluationsList = () => {
  const navigate = useNavigate()
  const { id, evaluation_id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, user_evaluations } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (id !== undefined) {
      void getEvaluations()
    }
  }, [id])

  const getEvaluations = async () => {
    if (id !== undefined) {
      const result = await appDispatch(
        getUserEvaluations({
          evaluation_administration_id: parseInt(id),
          for_evaluation: true,
        })
      )
      if (
        result.type === "user/getUserEvaluations/fulfilled" &&
        result.payload.length > 0 &&
        evaluation_id === "all"
      ) {
        navigate(
          `/evaluation-administrations/${id}/evaluations/${result.payload[0].id}`
        )
      }
    }
  }

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
            {user_evaluations.map((evaluation) => (
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
