import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { getEvaluationAdministration } from "../../../../redux/slices/evaluation-administration-slice"
import { Loading } from "../../../../types/loadingType"
import { ViewEvaluationHeader } from "../../../../features/admin/evaluation-administrations/[id]/view-evaluation-header"
import { ViewEvaluationList } from "../../../../features/admin/evaluation-administrations/[id]/view-evaluation-list"
import { ViewEvaluationFooter } from "../../../../features/admin/evaluation-administrations/[id]/view-evaluation-footer"
import { useTitle } from "../../../../hooks/useTitle"
import { WebSocketContext, type WebSocketType } from "../../../../components/providers/websocket"

export default function ViewEvaluation() {
  useTitle("View Evaluation")

  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, evaluation_administration } = useAppSelector(
    (state) => state.evaluationAdministration
  )
  const { loading: loading_evaluation_results, evaluation_results } = useAppSelector(
    (state) => state.evaluationResults
  )
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluationAdministration(parseInt(id)))
    }
  }, [id, lastJsonMessage])

  return (
    <div className='flex flex-col gap-2'>
      {loading === Loading.Pending && evaluation_administration === null && <div>Loading...</div>}
      {loading === Loading.Fulfilled && evaluation_administration === null && <div>Not found</div>}
      <div className='h-[calc(100vh_-_104px)] flex flex-col gap-2' id='scroll-container'>
        {evaluation_administration !== null && (
          <>
            <ViewEvaluationHeader />
            {loading_evaluation_results === Loading.Pending && <div>Loading...</div>}
            {loading_evaluation_results === Loading.Fulfilled && evaluation_results === null && (
              <div>Not found</div>
            )}
            {evaluation_results !== null && <ViewEvaluationList />}
          </>
        )}
        <ViewEvaluationFooter />
      </div>
    </div>
  )
}
