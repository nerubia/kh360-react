import { useRef, useState, useEffect } from "react"
import { Button } from "@components/ui/button/button"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { useParams } from "react-router-dom"
import {
  showCreateModal,
  setEvaluationTemplateContents,
  setSelectedContentIndex,
} from "@redux/slices/evaluation-template-contents-slice"
import { CreateEvaluationTemplateContentForm } from "@features/admin/evaluation-template-contents/evaluation-template-content-form/evaluation-template-content-form"
import { Icon } from "@components/ui/icon/icon"
import Dialog from "@components/ui/dialog/dialog"
import { Badge } from "@components/ui/badge/badge"
import { EvaluationTemplateContentCategory } from "@custom-types/evaluation-template-content-type"

export const EvaluationTemplateContentsTable = () => {
  const appDispatch = useAppDispatch()
  const { id } = useParams()
  const { create_modal_visible, evaluation_template_contents, selected_content_index } =
    useAppSelector((state) => state.evaluationTemplateContents)
  const { evaluation_template } = useAppSelector((state) => state.evaluationTemplate)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const dragContent = useRef<number>(0)
  const draggedOverContent = useRef<number>(0)

  useEffect(() => {
    void appDispatch(setEvaluationTemplateContents([]))
    if (id !== undefined) {
      const templateContentsCopy = [...(evaluation_template?.evaluationTemplateContents ?? [])]
      const sortedContents = templateContentsCopy.sort(
        (a, b) => (a.sequence_no ?? 0) - (b.sequence_no ?? 0)
      )
      void appDispatch(setEvaluationTemplateContents(sortedContents ?? []))
    }
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
    <div className='flex flex-col gap-8 mt-5'>
      <div className='text-xl text-primary-500 font-bold'>Evaluation Template Contents</div>
      <div>
        <table>
          <thead className='text-left'>
            <tr>
              <th className='p-2 border-b-4 text-start text-primary-500 md:w-1/4'>Name</th>
              <th className='p-2 border-b-4 text-start text-primary-500 md:w-1/2'>Description</th>
              <th className='p-2 border-b-4 text-start text-primary-500 md:w-1/8'>Rate</th>
              <th className='p-2 border-b-4 text-center text-primary-500 md:w-1/6'>Active</th>
              <th className='p-2 border-b-4 text-center text-primary-500 md:w-1/2'>Actions</th>
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
                <td className='p-2 border-b'>
                  <div className='flex gap-4 items-center'>
                    <Icon icon='Menu' size='extraSmall' />
                    <Badge
                      variant={`${
                        content.category === EvaluationTemplateContentCategory.PrimarySkillSet
                          ? "darkPurple"
                          : "primary"
                      }`}
                      size='iconSize'
                    >
                      {content.category === EvaluationTemplateContentCategory.PrimarySkillSet
                        ? "P"
                        : "S"}
                    </Badge>
                    <div>{content.name}</div>
                  </div>
                </td>
                <td className='p-2 border-b text-start'>{content.description}</td>
                <td className='p-2 border-b text-start items-center '>
                  {Number(content.rate).toFixed(2)}%
                </td>
                <td className='p-2 border-b'>
                  <div className='flex items-center justify-center '>
                    <Badge variant={`${content.is_active === true ? "green" : "red"}`} size='small'>
                      {content.is_active === true ? "YES" : "NO"}
                    </Badge>
                  </div>
                </td>
                <td className='p-2 border-b text-center items-center md:w-1/2'>
                  <div className='flex gap-2 justify-center'>
                    <Button
                      testId={`EditButton${content.id}`}
                      variant='unstyled'
                      onClick={() => {
                        toggleEditModalForm()
                        void appDispatch(setSelectedContentIndex(index))
                      }}
                    >
                      <Icon icon='PenSquare' size='extraSmall' color='gray' />
                    </Button>
                    <Button
                      testId={`DeleteButton${content.id}`}
                      variant='unstyled'
                      onClick={() => {
                        toggleDeleteDialog()
                        void appDispatch(setSelectedContentIndex(index))
                      }}
                    >
                      <Icon icon='Trash' size='extraSmall' color='gray' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {evaluation_template_contents.length === 0 ? (
          <div className='py-4 border-b mr-2 pl-20'>
            No template content added yet. Click{" "}
            <span onClick={toggleModalForm} className='text-primary-500 cursor-pointer underline'>
              {" "}
              here
            </span>{" "}
            to add.
          </div>
        ) : (
          <div className='flex justify-end mt-5'>
            <Button onClick={toggleModalForm}>Add Template Content</Button>
          </div>
        )}
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
