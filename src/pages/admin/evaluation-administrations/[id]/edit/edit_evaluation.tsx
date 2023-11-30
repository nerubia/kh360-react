import { useTitle } from "../../../../../hooks/useTitle"
import { EditEvaluationForm } from "../../../../../features/admin/evaluation-administrations/[id]/edit/edit-evaluation-form"

export default function EditEvaluation() {
  useTitle("Edit Evaluation")

  return (
    <div className='flex flex-col'>
      <EditEvaluationForm />
    </div>
  )
}
