import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import {
  getEvaluationAdministration,
  getEvaluationAdministrationSocket,
} from "@redux/slices/evaluation-administration-slice"
import { Loading } from "@custom-types/loadingType"
import { EvaluationProgressHeader } from "@features/admin/evaluation-administrations/[id]/progress/evaluation-progress-header"
import { EvaluationProgressList } from "@features/admin/evaluation-administrations/[id]/progress/evaluation-progress-list"
import { EvaluationProgressFooter } from "@features/admin/evaluation-administrations/[id]/progress/evaluation-progress-footer"
import { useTitle } from "@hooks/useTitle"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"

export default function EvaluationProgress() {
  useTitle("Evaluation Progress")

  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, loading_evaluators, evaluators, evaluation_administration } = useAppSelector(
    (state) => state.evaluationAdministration
  )
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluationAdministration(parseInt(id)))
    }
  }, [id])

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluationAdministrationSocket(parseInt(id)))
    }
  }, [lastJsonMessage])

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
