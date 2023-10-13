import { useParams } from "react-router-dom"
import { LinkButton } from "../../components/button/Button"
import { Icon } from "../../components/icon/Icon"
import { useEffect } from "react"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { getEvaluation } from "../../redux/slices/evaluationsSlice"
import { useAppSelector } from "../../hooks/useAppSelector"
import moment from "moment"

export default function ViewEvaluation() {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, evaluation } = useAppSelector((state) => state.evaluations)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluation(id))
    }
  }, [id])

  return (
    <div className='flex flex-col gap-4'>
      <LinkButton variant='unstyled' to='/evaluations'>
        <Icon icon='ChevronLeft' />
        Go back
      </LinkButton>
      {loading && <div>Loading...</div>}
      {!loading && evaluation == null && <div>Not found</div>}
      {!loading && evaluation !== null && (
        <div className='flex flex-col'>
          <div>Name: {evaluation.name}</div>
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
          <LinkButton to={`/evaluations/${id}/employees`}>
            Select employees
          </LinkButton>
        </div>
      )}
    </div>
  )
}
