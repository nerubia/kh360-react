import moment from "moment"
import { LinkButton } from "../../../../components/button/Button"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useParams } from "react-router-dom"

export const ViewEvaluationHeader = () => {
  const { evaluationAdministration } = useAppSelector((state) => state.evaluation_administration)
  const { id } = useParams()

  return (
    <>
      <div className='text-right'>
        <h1>Evaluation Schedule</h1>(
        {moment(evaluation?.eval_schedule_start_date).format("MMM D, YYYY")} to{" "}
        {moment(evaluation?.eval_schedule_end_date).format("MMM D, YYYY")})
      </div>
      <div className='flex flex-col'>
        <div className='flex justify-between mt-2'>
          <h1 className='text-2xl font-bold'>{evaluation?.name}</h1>
          <LinkButton
            variant='primary'
            size='medium'
            to={`/admin/evaluations/${id}/edit`}
          >
            Edit
          </LinkButton>
        </div>
        <div className='mb-4'>
          Evaluation Period (
          {moment(evaluation?.eval_period_start_date).format("MMM D, YYYY")} -{" "}
          {moment(evaluation?.eval_period_end_date).format("MMM D, YYYY")})
        </div>
        <div>{evaluation?.remarks}</div>
      </div>
      <h1 className='text-2xl font-bold mt-5 mb-5'>Employees</h1>
    </>
  )
}
