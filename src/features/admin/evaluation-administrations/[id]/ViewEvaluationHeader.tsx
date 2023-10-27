import moment from "moment"
import { LinkButton } from "../../../../components/button/Button"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useParams } from "react-router-dom"
import { EvaluationAdministrationStatus } from "../../../../types/evaluationAdministrationType"

export const ViewEvaluationHeader = () => {
  const { evaluation_administration } = useAppSelector(
    (state) => state.evaluationAdministration
  )
  const { id } = useParams()

  return (
    <>
      <div className='text-right'>
        <h1>Evaluation Schedule</h1>(
        {moment(evaluation_administration?.eval_schedule_start_date).format(
          "MMM D, YYYY"
        )}{" "}
        to{" "}
        {moment(evaluation_administration?.eval_schedule_end_date).format(
          "MMM D, YYYY"
        )}
        )
      </div>
      <div className='flex flex-col'>
        <div className='flex justify-between items-center  mt-2'>
          <div>
            <h1 className='text-2xl font-bold'>
              {evaluation_administration?.name}
            </h1>
            <div>
              Evaluation Period (
              {moment(evaluation_administration?.eval_period_start_date).format(
                "MMM D, YYYY"
              )}{" "}
              -{" "}
              {moment(evaluation_administration?.eval_period_end_date).format(
                "MMM D, YYYY"
              )}
              )
            </div>
          </div>
          <div className='flex justify-between gap-4'>
            <LinkButton
              variant='primary'
              size='medium'
              to={`/admin/evaluation-administrations/${id}/edit`}
            >
              Edit
            </LinkButton>
            {evaluation_administration?.status ===
              EvaluationAdministrationStatus.Pending ||
            evaluation_administration?.status ===
              EvaluationAdministrationStatus.Ongoing ||
            evaluation_administration?.status ===
              EvaluationAdministrationStatus.Closed ||
            evaluation_administration?.status ===
              EvaluationAdministrationStatus.Cancelled ? (
              <LinkButton variant='primary' size='medium' to={``}>
                Progress
              </LinkButton>
            ) : null}
          </div>
        </div>
        <div className='mt-4'>{evaluation_administration?.remarks}</div>
      </div>
      <h1 className='text-2xl font-bold mt-5 mb-5'>Employees</h1>
    </>
  )
}
