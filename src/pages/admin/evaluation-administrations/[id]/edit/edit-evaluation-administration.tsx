import { useTitle } from "@hooks/useTitle"
import { EditEvaluationAdministrationForm } from "@features/admin/evaluation-administrations/[id]/edit/edit-evaluation-administration-form"

export default function EditEvaluationAdministration() {
  useTitle("Edit Evaluation Administration")

  return (
    <div className='flex flex-col'>
      <EditEvaluationAdministrationForm />
    </div>
  )
}
