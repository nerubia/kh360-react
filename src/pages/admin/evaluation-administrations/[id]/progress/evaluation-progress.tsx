import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../hooks/useAppSelector"
import { getEvaluationAdministration } from "../../../../../redux/slices/evaluation-administration-slice"
import { Loading } from "../../../../../types/loadingType"
import { EvaluationProgressHeader } from "../../../../../features/admin/evaluation-administrations/[id]/progress/evaluation-progress-header"
import { EvaluationProgressList } from "../../../../../features/admin/evaluation-administrations/[id]/progress/evaluation-progress-list"
import { EvaluationProgressFooter } from "../../../../../features/admin/evaluation-administrations/[id]/progress/evaluation-progress-footer"

export default function EvaluationProgress() {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, loading_evaluators, evaluators, evaluation_administration } = useAppSelector(
    (state) => state.evaluationAdministration
  )

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluationAdministration(parseInt(id)))
    }
  }, [id])

  return (
    <div className='flex flex-col gap-2'>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && evaluation_administration === null && <div>Not found</div>}
      <div className='h-[calc(100vh_-_104px)] flex flex-col gap-2' id='scroll-container'>
        {loading === Loading.Fulfilled && evaluation_administration !== null && (
          <>
            <EvaluationProgressHeader />
            {loading_evaluators === Loading.Pending && <div>Loading...</div>}
            {loading_evaluators === Loading.Fulfilled && evaluators === null && (
              <div>Not found</div>
            )}
            {evaluators !== null && <EvaluationProgressList />}
          </>
        )}
        <EvaluationProgressFooter />
      </div>
    </div>
  )
}
