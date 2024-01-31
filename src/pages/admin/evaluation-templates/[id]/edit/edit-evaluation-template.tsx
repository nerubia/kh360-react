import { useEffect } from "react"
import { useTitle } from "@hooks/useTitle"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { getEvaluationTemplate } from "@redux/slices/evaluation-template-slice"
import { Loading } from "@custom-types/loadingType"
import { Spinner } from "@components/ui/spinner/spinner"
import { EditEvaluationTemplateHeader } from "@features/admin/evaluation-templates/[id]/edit/edit-evaluation-template-header"
import { CreateEvaluationTemplateForm } from "@features/admin/evaluation-templates/create/evaluation-template-form"

export default function EditEvaluationTemplate() {
  useTitle("Edit Evaluation Template")

  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.evaluationTemplate)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluationTemplate(parseInt(id)))
    }
  }, [])

  return (
    <div className='flex flex-col gap-5'>
      {loading === Loading.Pending && <Spinner />}
      {loading === Loading.Fulfilled && (
        <>
          <EditEvaluationTemplateHeader />
          <CreateEvaluationTemplateForm />
        </>
      )}
      {loading === Loading.Rejected && <div>Not found</div>}
    </div>
  )
}
