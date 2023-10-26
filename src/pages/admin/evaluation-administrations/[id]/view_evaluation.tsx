import { useEffect } from "react"
import { useParams } from "react-router-dom"
import moment from "moment"
import { LinkButton } from "../../../../components/button/Button"
import { Icon } from "../../../../components/icon/Icon"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { getEvaluationAdministration } from "../../../../redux/slices/evaluationAdministrationSlice"
import { Loading } from "../../../../types/loadingType"

export default function ViewEvaluation() {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, evaluation_administration } = useAppSelector(
    (state) => state.evaluationAdministration
  )

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluationAdministration(id))
    }
  }, [id])

  return (
    <div className='flex flex-col gap-4'>
      <LinkButton variant='unstyled' to='/admin/evaluation-administrations'>
        <Icon icon='ChevronLeft' />
        Go back
      </LinkButton>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && evaluation_administration == null && (
        <div>Not found</div>
      )}
      {loading === Loading.Fulfilled && evaluation_administration !== null && (
        <div className='flex flex-col'>
          <h1 className='text-lg font-bold'>
            {evaluation_administration.name}
          </h1>
          <div>Description: {evaluation_administration.remarks}</div>
          <div>
            Period:{" "}
            {moment(evaluation_administration.eval_period_start_date).format(
              "MMM D YYYY"
            )}{" "}
            -{" "}
            {moment(evaluation_administration.eval_period_end_date).format(
              "MMM D YYYY"
            )}
          </div>
          <div>
            Schedule:{" "}
            {moment(evaluation_administration.eval_schedule_start_date).format(
              "MMM D YYYY"
            )}{" "}
            -{" "}
            {moment(evaluation_administration.eval_schedule_end_date).format(
              "MMM D YYYY"
            )}
          </div>
          <LinkButton to={`/admin/evaluation-administrations/${id}/select`}>
            Select employees
          </LinkButton>
        </div>
      )}
    </div>
  )
}
