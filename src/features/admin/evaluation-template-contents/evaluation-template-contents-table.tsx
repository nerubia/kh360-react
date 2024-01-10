import { Button } from "../../../components/ui/button/button"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { showCreateModal } from "../../../redux/slices/evaluation-template-contents-slice"
import { CreateEvaluationTemplateContentForm } from "./evaluation-template-content-form/evaluation-template-content-form"

export const EvaluationTemplateContentsTable = () => {
  const appDispatch = useAppDispatch()
  const { create_modal_visible } = useAppSelector((state) => state.evaluationTemplateContents)

  const toggleModalForm = () => {
    void appDispatch(showCreateModal(!create_modal_visible))
  }

  return (
    <div className='flex flex-col gap-8'>
      <table className='w-full table-fixed'>
        <thead className='text-left'>
          <tr>
            <th className='pb-3'>Name</th>
            <th className='pb-3'>Description</th>
            <th className='pb-3'>Category</th>
            <th className='pb-3'>Rate</th>
            <th className='pb-3'>Active</th>
            <th className='pb-3'>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div className='flex justify-end'>
        <Button onClick={toggleModalForm}>Add Template Content</Button>
      </div>
      <CreateEvaluationTemplateContentForm />
    </div>
  )
}
