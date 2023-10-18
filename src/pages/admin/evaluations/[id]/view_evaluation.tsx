import { useEffect } from "react"
import { useParams } from "react-router-dom"
import moment from "moment"
import { LinkButton } from "../../../../components/button/Button"
import { Icon } from "../../../../components/icon/Icon"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { getEvaluation } from "../../../../redux/slices/evaluationSlice"
import { Loading } from "../../../../types/loadingType"

export default function ViewEvaluation() {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, evaluation } = useAppSelector((state) => state.evaluation)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluation(id))
    }
  }, [id])

  return (
    <div className='flex flex-col gap-4'>
      <LinkButton variant='unstyled' to='/admin/evaluations'>
        <Icon icon='ChevronLeft' />
        Go back
      </LinkButton>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && evaluation == null && (
        <div>Not found</div>
      )}
      {loading === Loading.Fulfilled && evaluation !== null && (
        <div className='flex flex-col'>
          <h1 className='text-lg font-bold'>{evaluation.name}</h1>
          <div>Description: {evaluation.remarks}</div>
          <div>
            Period:{" "}
            {moment(evaluation.eval_period_start_date).format("MMM D YYYY")} -{" "}
            {moment(evaluation.eval_period_end_date).format("MMM D YYYY")}
          </div>
          <div>
            Schedule:{" "}
            {moment(evaluation.eval_schedule_start_date).format("MMM D YYYY")} -{" "}
            {moment(evaluation.eval_schedule_end_date).format("MMM D YYYY")}
          </div>
          <LinkButton to={`/admin/evaluations/${id}/select`}>
            Select employees
          </LinkButton>
        </div>
      )}
    </div>
  )
}
