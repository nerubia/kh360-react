import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { Loading } from "../../../types/loadingType"
import { Button } from "../../../components/ui/button/button"
import { Icon } from "../../../components/ui/icon/icon"
import { DistributionChart } from "../../../components/shared/distribution-chart/distribution-chart"
import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js"
import { getEvaluators } from "../../../redux/slices/evaluation-result-slice"
import { type User } from "../../../types/user-type"

export const ViewEvaluationResultsChart = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading_evaluators, evaluation_result, evaluators } = useAppSelector(
    (state) => state.evaluationResult
  )
  const [showChart, setShowChart] = useState<boolean>(false)
  const [dispatchedEvaluators, setDispatchedEvaluators] = useState<boolean>(false)
  const [sortedEvaluators, setSortedEvaluators] = useState<User[]>([])

  useEffect(() => {
    if (evaluators.length > 0) {
      const sortedEvaluators = [...evaluators]
      sortedEvaluators.sort((a, b) => {
        const nameA = `${a?.last_name} ${a?.first_name}`.toLowerCase()
        const nameB = `${b?.last_name} ${b?.first_name}`.toLowerCase()

        if (nameA < nameB) {
          return -1
        } else if (nameA > nameB) {
          return 1
        } else {
          return 0
        }
      })
      setSortedEvaluators(sortedEvaluators)
    } else {
      setSortedEvaluators([])
    }
  }, [evaluators])

  const toggleChart = () => {
    if (id !== undefined && evaluation_result !== null && !dispatchedEvaluators) {
      void appDispatch(getEvaluators(parseInt(id)))
      setDispatchedEvaluators(true)
    }
    setShowChart((prev) => !prev)
  }

  Chart.register(CategoryScale)

  return (
    <div>
      <Button variant='unstyled' onClick={toggleChart}>
        <div className='flex gap-2 text-xl font-bold mb-2 text-primary-500'>
          Distribution Chart:
          {showChart ? <Icon icon='ChevronDown' /> : <Icon icon='ChevronUp' />}{" "}
        </div>
      </Button>
      {loading_evaluators === Loading.Pending && <div>Loading...</div>}
      {loading_evaluators === Loading.Fulfilled && evaluators === null && <div>Not found</div>}
      {loading_evaluators === Loading.Fulfilled &&
        evaluators !== undefined &&
        evaluators.length > 0 &&
        id !== undefined && (
          <div>
            {showChart && evaluators?.length > 0 && (
              <div>
                {sortedEvaluators?.map((evaluator) => (
                  <div key={evaluator.id} className='mb-10 flex items-end justify-start'>
                    <div className='pb-4 md:w-[210px]'>
                      {evaluator.last_name}, {evaluator.first_name}
                    </div>
                    {evaluation_result?.users !== undefined && (
                      <DistributionChart
                        evaluator={evaluator}
                        currentEvaluee={evaluation_result?.users}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  )
}
