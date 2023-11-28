import { useEffect } from "react"
import { ExternalEvaluatorForm } from "../../../../../features/admin/external-evaluators/external-evaluator-form/external-evaluator-form"
import { useTitle } from "../../../../../hooks/useTitle"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { getExternalUser } from "../../../../../redux/slices/external-user-slice"
import { useParams } from "react-router-dom"
import { ExternalEvaluatorHeader } from "../../../../../features/admin/external-evaluators/external-evaluator-form/external-evaluator-header"
import { useAppSelector } from "../../../../../hooks/useAppSelector"
import { Loading } from "../../../../../types/loadingType"
import { Spinner } from "../../../../../components/ui/spinner/spinner"

export default function EditExternalEvaluator() {
  useTitle("Edit External Evaluator")

  const appDispatch = useAppDispatch()
  const { id } = useParams()
  const { loading } = useAppSelector((state) => state.externalUser)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getExternalUser(parseInt(id)))
    }
  }, [])

  return (
    <div className='flex flex-col gap-5'>
      {loading === Loading.Pending && <Spinner />}
      {loading === Loading.Fulfilled && (
        <>
          <ExternalEvaluatorHeader title='Edit External Evaluator' />
          <ExternalEvaluatorForm />
        </>
      )}
      {loading === Loading.Rejected && <div>Not found</div>}
    </div>
  )
}
