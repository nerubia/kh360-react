import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { getEvaluationAdministration } from "../../../../redux/slices/evaluationAdministrationSlice"
import { Loading } from "../../../../types/loadingType"
import { ViewEvaluationHeader } from "../../../../features/admin/evaluation-administrations/[id]/ViewEvaluationHeader"
import { ViewEvaluationList } from "../../../../features/admin/evaluation-administrations/[id]/ViewEvaluationList"

export default function ViewEvaluation() {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, evaluation_administration } = useAppSelector(
    (state) => state.evaluationAdministration
  )
  const { loading: loading_evaluation_results, evaluation_results } =
    useAppSelector((state) => state.evaluationResults)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluationAdministration(parseInt(id)))
    }
  }, [id])

  return (
    <div className='flex flex-col gap-2'>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && evaluation_administration == null && (
        <div>Not found</div>
      )}
      {loading === Loading.Fulfilled && evaluation_administration !== null && (
        <div
          className='h-[calc(100vh_-_104px)] flex flex-col gap-2'
          id='scroll-container'
        >
          <ViewEvaluationHeader />
          {loading_evaluation_results === Loading.Pending && (
            <div>Loading...</div>
          )}
          {loading_evaluation_results === Loading.Fulfilled &&
            evaluation_results === null && <div>Not found</div>}
          {evaluation_results !== null && <ViewEvaluationList />}
        </div>
      )}
    </div>
  )
}
