import { useAppSelector } from "../../../../../hooks/useAppSelector"
import { formatDate } from "../../../../../utils/format-date"
import { PageTitle } from "../../../../../components/shared/PageTitle"
import { Badge } from "../../../../../components/ui/badge/Badge"
import { getEvaluationAdministrationStatusVariant } from "../../../../../utils/variant"

export const EvaluationProgressHeader = () => {
  const { evaluation_administration } = useAppSelector((state) => state.evaluationAdministration)

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col justify-between items-start md:items-end mt-2 md:flex-row gap-4'>
          <div>
            <PageTitle>Evaluation Progress</PageTitle>
            <div className='flex gap-4 primary-outline items-end my-4'>
              <p className='text-xl font-bold'>{evaluation_administration?.name}</p>
              <Badge
                variant={getEvaluationAdministrationStatusVariant(
                  evaluation_administration?.status
                )}
              >
                <div className='uppercase'>{evaluation_administration?.status}</div>
              </Badge>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Evaluation Period: </div>
              {formatDate(evaluation_administration?.eval_period_start_date)} to{" "}
              {formatDate(evaluation_administration?.eval_period_end_date)}
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Evaluation Schedule: </div>
              {formatDate(evaluation_administration?.eval_schedule_start_date)} to{" "}
              {formatDate(evaluation_administration?.eval_schedule_end_date)}
            </div>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <pre className='font-sans whitespace-pre-wrap break-words'>
          {evaluation_administration?.remarks}
        </pre>
      </div>
      <h1 className='text-2xl font-bold mt-5 mb-5'>Evaluators</h1>
    </>
  )
}
