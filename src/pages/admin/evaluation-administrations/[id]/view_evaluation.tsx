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

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluationAdministration(parseInt(id)))
    }
  }, [])

  return (
    <div className='flex flex-col gap-2'>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && evaluation_administration == null && (
        <div>Not found</div>
      )}
      {loading === Loading.Fulfilled && evaluation_administration !== null && (
        <div className='h-[calc(100vh_-_104px)] flex flex-col gap-2'>
          <ViewEvaluationHeader />
          <ViewEvaluationList />
        </div>
      )}
    </div>
  )
}
