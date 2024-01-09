import { useState } from "react"
import { useAppSelector } from "../../../../../hooks/useAppSelector"
import { PageTitle } from "../../../../../components/shared/page-title"
import { Badge } from "../../../../../components/ui/badge/badge"
import { getEvaluationAdministrationStatusVariant } from "../../../../../utils/variant"
import { Button } from "../../../../../components/ui/button/button"
import { Icon } from "../../../../../components/ui/icon/icon"
import { useMobileView } from "../../../../../hooks/use-mobile-view"
import { DateRangeDisplay } from "../../../../../components/shared/display-range-date"

export const EvaluationProgressHeader = () => {
  const { evaluation_administration } = useAppSelector((state) => state.evaluationAdministration)
  const [showDescription, setShowDescription] = useState<boolean>(false)
  const isMobile = useMobileView()

  const toggleDescription = () => {
    setShowDescription((prev) => !prev)
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col justify-between items-start md:items-end mt-2 md:flex-row gap-4'>
          <div>
            <PageTitle>Evaluation Progress</PageTitle>
            <div className='flex gap-4 primary-outline items-end my-4'>
              <p className='text-xl font-bold'>{evaluation_administration?.name}</p>
              <Badge
                size={isMobile ? "small" : "medium"}
                variant={getEvaluationAdministrationStatusVariant(
                  evaluation_administration?.status
                )}
              >
                <div className='uppercase'>{evaluation_administration?.status}</div>
              </Badge>
            </div>
            <DateRangeDisplay
              label='Evaluation Period'
              startDate={evaluation_administration?.eval_period_start_date}
              endDate={evaluation_administration?.eval_period_end_date}
              isMobile={isMobile}
            />
            <DateRangeDisplay
              label='Evaluation Schedule'
              startDate={evaluation_administration?.eval_schedule_start_date}
              endDate={evaluation_administration?.eval_schedule_end_date}
              isMobile={isMobile}
            />
          </div>
        </div>
        <div className='font-bold'>
          <Button variant='unstyled' onClick={toggleDescription}>
            Description:
            {showDescription ? <Icon icon='ChevronDown' /> : <Icon icon='ChevronUp' />}{" "}
          </Button>
        </div>
        {showDescription && (
          <pre className='font-sans whitespace-pre-wrap break-words'>
            {evaluation_administration?.remarks}
          </pre>
        )}
      </div>
      <h1 className='text-2xl font-bold my-2'>Evaluators</h1>
    </>
  )
}
