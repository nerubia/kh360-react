import { useRef, useState, useEffect } from "react"
import { Button } from "@components/ui/button/button"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import {
  showCreateModal,
  setEvaluationTemplateContents,
  setSelectedContentIndex,
} from "@redux/slices/evaluation-template-contents-slice"
import { CreateEvaluationTemplateContentForm } from "@features/admin/evaluation-template-contents/evaluation-template-content-form/evaluation-template-content-form"
import { Icon } from "@components/ui/icon/icon"
import Dialog from "@components/ui/dialog/dialog"
import { Badge } from "@components/ui/badge/badge"

export const EvaluationTemplateContentsTable = () => {
  const appDispatch = useAppDispatch()
  const { create_modal_visible, evaluation_template_contents, selected_content_index } =
    useAppSelector((state) => state.evaluationTemplateContents)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const dragContent = useRef<number>(0)
  const draggedOverContent = useRef<number>(0)

  useEffect(() => {
    void appDispatch(setEvaluationTemplateContents([]))
  }, [])

  const toggleModalForm = () => {
    void appDispatch(setSelectedContentIndex(null))
    void appDispatch(showCreateModal(!create_modal_visible))
  }

  const toggleEditModalForm = () => {
    void appDispatch(showCreateModal(!create_modal_visible))
  }

  const toggleDeleteDialog = () => {
    setShowDeleteDialog((prev) => !prev)
  }

  const handleDelete = () => {
    const updatedContents = evaluation_template_contents.filter(
      (_, index) => index !== selected_content_index
    )
    void appDispatch(setEvaluationTemplateContents(updatedContents))
  }

  const handleSort = () => {
    const evaluationTemplateContentsData = [...evaluation_template_contents]
    const draggedItem = evaluationTemplateContentsData[dragContent.current]

    evaluationTemplateContentsData.splice(dragContent.current, 1)
    evaluationTemplateContentsData.splice(draggedOverContent.current, 0, draggedItem)

    void appDispatch(setEvaluationTemplateContents(evaluationTemplateContentsData))
  }

  return (
    <div className='flex flex-col gap-8'>
      <table className='w-full table-fixed'>
        <thead className='text-left'>
          <tr>
            <th className='pb-3'>Name</th>
            <th className='pb-3'>Description</th>
            <th className='pb-3'>Category</th>
            <th className='pb-3 text-center'>Rate</th>
            <th className='pb-3 text-center'>Active</th>
            <th className='pb-3'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evaluation_template_contents.map((content, index) => (
            <tr
              key={index}
              className={`hover:bg-slate-100 cursor-grab`}
              draggable
              onDragStart={() => {
                dragContent.current = index
              }}
              onDragEnter={() => (draggedOverContent.current = index)}
              onDragEnd={() => {
                handleSort()
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <td className='py-1 border-b'>
                <div className='flex gap-3 items-center'>
                  <Icon icon='Menu' size='extraSmall' />
                  <div>{content.name}</div>
                </div>
              </td>
              <td className='py-1 border-b text-start'>{content.description}</td>
              <td className='py-1 border-b text-start items-center '>{content.category}</td>
              <td className='py-1 border-b text-center items-center '>
                {Number(content.rate).toFixed(2)}%
              </td>
              <td className='py-1 border-b text-center'>
                <div className='flex justify-center '>
                  <Badge variant={`${content.is_active === true ? "green" : "red"}`} size='small'>
                    {content.is_active === true ? "YES" : "NO"}
                  </Badge>
                </div>
              </td>
              <td className='py-1 border-b text-center items-center md:w-1/2'>
                <div className='flex gap-2 '>
                  <Button
                    testId={`EditButton${content.id}`}
                    variant='unstyled'
                    onClick={() => {
                      toggleEditModalForm()
                      void appDispatch(setSelectedContentIndex(index))
                    }}
                  >
                    <Icon icon='PenSquare' />
                  </Button>
                  <Button
                    testId={`DeleteButton${content.id}`}
                    variant='unstyled'
                    onClick={() => {
                      toggleDeleteDialog()
                      void appDispatch(setSelectedContentIndex(index))
                    }}
                  >
                    <Icon icon='Trash' />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-end'>
        <Button onClick={toggleModalForm}>Add Template Content</Button>
      </div>
      <CreateEvaluationTemplateContentForm />
      <Dialog open={showDeleteDialog}>
        <Dialog.Title>Delete Evaluation Template Content</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this evaluation template content? This will delete all
          data and cannot be reverted.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={() => toggleDeleteDialog()}>
            No
          </Button>
          <Button
            variant='primary'
            onClick={async () => {
              handleDelete()
              toggleDeleteDialog()
            }}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  )
}
