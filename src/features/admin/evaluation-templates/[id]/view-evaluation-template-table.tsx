import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { Loading } from "../../../../types/loadingType"
import Dialog from "../../../../components/ui/dialog/dialog"
import { Button } from "../../../../components/ui/button/button"
import { Checkbox } from "../../../../components/ui/checkbox/checkbox"
import { Icon } from "../../../../components/ui/icon/icon"
import {
  deleteEvaluationTemplateContent,
  updateEvaluationTemplateContent,
} from "../../../../redux/slices/evaluation-template-content-slice"
import {
  removeEvaluationTemplateContent,
  setEvaluationTemplateContent,
} from "../../../../redux/slices/evaluation-template-slice"
import { setAlert } from "../../../../redux/slices/app-slice"
import { type EvaluationTemplateContentFormData } from "../../../../types/form-data-type"
import { Input } from "../../../../components/ui/input/input"
import { TextArea } from "../../../../components/ui/textarea/text-area"
import { CustomSelect } from "../../../../components/ui/select/custom-select"
import { type Option } from "../../../../types/optionType"
import { EvaluationTemplateContentCategory } from "../../../../types/evaluation-template-content-type"
import { Badge } from "../../../../components/ui/badge/badge"

const categoryOptions: Option[] = Object.values(EvaluationTemplateContentCategory).map((value) => ({
  label: value,
  value,
}))

export const ViewEvaluationTemplateTable = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, evaluation_template } = useAppSelector((state) => state.evaluationTemplate)
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [selectedEvaluationTemplateContentId, setSelectedEvaluationTemplateContentId] =
    useState<number>()
  const [formData, setFormData] = useState<EvaluationTemplateContentFormData>({
    name: "",
    description: "",
    category: "",
    rate: "",
    is_active: false,
  })

  useEffect(() => {
    if (evaluation_template?.evaluationTemplateContents !== undefined) {
      evaluation_template?.evaluationTemplateContents.map((content) => {
        return setCheckedItems((prevItems) => ({
          ...prevItems,
          [content.id]: content.is_active ?? false,
        }))
      })
    }
  }, [evaluation_template])

  const toggleEditDialog = (contentId: number | null) => {
    if (evaluation_template?.evaluationTemplateContents !== undefined) {
      const evaluationTemplateContent = evaluation_template.evaluationTemplateContents.find(
        (content) => content.id === contentId
      )
      if (contentId !== null && evaluationTemplateContent !== undefined) {
        setSelectedEvaluationTemplateContentId(contentId)
        setFormData({
          name: evaluationTemplateContent.name,
          description: evaluationTemplateContent.description,
          category: evaluationTemplateContent.category,
          rate: evaluationTemplateContent.rate,
          is_active: evaluationTemplateContent.is_active,
        })
      }
    }
    setShowEditDialog((prev) => !prev)
  }

  const toggleDeleteDialog = (id: number | null) => {
    if (id !== null) {
      setSelectedEvaluationTemplateContentId(id)
    }
    setShowDeleteDialog((prev) => !prev)
  }

  const checkNumberValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const parsedValue = Number(inputValue)

    if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 100) {
      setFormData({ ...formData, rate: handleDecimalsOnValue(e.target.value) })
    }
  }

  const handleDecimalsOnValue = (value: string) => {
    const regex = /([0-9]*[.|,]{0,1}[0-9]{0,2})/s
    const matchResult = value.match(regex)

    if (matchResult !== null) {
      return matchResult[0]
    }
    return ""
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTextAreaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDelete = async () => {
    if (selectedEvaluationTemplateContentId !== undefined) {
      try {
        const result = await appDispatch(
          deleteEvaluationTemplateContent(selectedEvaluationTemplateContentId)
        )
        if (result.type === "evaluationTemplateContent/deleteEvaluationTemplateContent/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "evaluationTemplateContent/deleteEvaluationTemplateContent/fulfilled") {
          appDispatch(
            removeEvaluationTemplateContent({
              evaluationTemplateContentId: selectedEvaluationTemplateContentId,
            })
          )
          appDispatch(
            setAlert({
              description: "Evaluation template content deleted successfully",
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  const handleSave = async () => {
    if (id !== undefined) {
      if (selectedEvaluationTemplateContentId !== undefined) {
        try {
          const result = await appDispatch(
            updateEvaluationTemplateContent({
              id: selectedEvaluationTemplateContentId,
              evaluation_template_contents_data: formData,
            })
          )
          if (
            result.type === "evaluationTemplateContent/updateEvaluationTemplateContent/rejected"
          ) {
            appDispatch(
              setAlert({
                description: result.payload,
                variant: "destructive",
              })
            )
          }
          if (
            result.type === "evaluationTemplateContent/updateEvaluationTemplateContent/fulfilled"
          ) {
            appDispatch(
              setEvaluationTemplateContent({
                evaluationTemplateContentId: selectedEvaluationTemplateContentId,
                evaluationTemplateContent: result.payload,
              })
            )
            appDispatch(
              setAlert({
                description: "Evaluation template content updated successfully",
                variant: "success",
              })
            )
          }
        } catch (error) {}
      }
    }
  }

  return (
    <>
      <div className='flex-1 flex flex-col gap-5 overflow-y-scroll'>
        <div className='text-xl text-primary-500 font-bold'>Evaluation Template Contents </div>
        {loading === Loading.Pending && <div>Loading...</div>}
        {loading === Loading.Fulfilled &&
          evaluation_template?.evaluationTemplateContents === null && <div>Not found</div>}
        <div className='overflow-y-scroll'>
          {loading === Loading.Fulfilled &&
            evaluation_template?.evaluationTemplateContents !== undefined &&
            evaluation_template?.evaluationTemplateContents.length > 0 &&
            id !== undefined && (
              <>
                <table>
                  <thead className='text-left'>
                    <tr>
                      <th className='py-1 border-b-4 mr-2 text-primary-500 md:w-1/4'>Name</th>
                      <th className='py-1 border-b-4 text-start text-primary-500 md:w-1/3'>
                        Description
                      </th>
                      <th className='py-1 border-b-4 mr-2 text-center text-primary-500 md:w-1/5'>
                        Category
                      </th>
                      <th className='py-1 border-b-4 mr-2 text-start text-primary-500 md:w-1/8'>
                        Rate
                      </th>
                      <th className='py-1 border-b-4 mr-2 text-center text-primary-500 md:w-1/6'>
                        Status
                      </th>
                      <th className='py-1 border-b-4 m-5 text-start text-primary-500 md:w-1/2'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluation_template?.evaluationTemplateContents.map((content) => (
                      <tr key={content.id} className='hover:bg-slate-100'>
                        <td className='py-1 border-b'>{content.name}</td>
                        <td className='py-1 border-b text-start'>{content.description}</td>
                        <td className='py-1 border-b text-center items-center '>
                          {content.category}
                        </td>
                        <td className='py-1 border-b text-start items-center '>
                          {Number(content.rate).toFixed(2)}%
                        </td>
                        <td className='py-1 border-b'>
                          <div className='flex items-center justify-center'>
                            <Badge
                              variant={`${checkedItems[content.id] ? "green" : "red"}`}
                              size='small'
                            >
                              {checkedItems[content.id] ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                          </div>
                        </td>
                        <td className='py-1 border-b text-center items-center md:w-1/2'>
                          <div className='flex gap-2 '>
                            <Button
                              testId={`EditButton${content.id}`}
                              variant='unstyled'
                              onClick={() => toggleEditDialog(content.id)}
                            >
                              <Icon icon='PenSquare' />
                            </Button>
                            <Button
                              testId={`DeleteButton${content.id}`}
                              variant='unstyled'
                              onClick={() => toggleDeleteDialog(content.id)}
                            >
                              <Icon icon='Trash' />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
        </div>
        <Dialog open={showDeleteDialog}>
          <Dialog.Title>Delete Evaluation Template Content</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete this evaluation template content? This will delete all
            data and cannot be reverted.
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant='primaryOutline' onClick={() => toggleDeleteDialog(null)}>
              No
            </Button>
            <Button
              variant='primary'
              onClick={async () => {
                await handleDelete()
                toggleDeleteDialog(null)
              }}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog open={showEditDialog} size={"medium"} maxWidthMin={true}>
          <Dialog.Title>Edit Evaluation Template Content</Dialog.Title>
          <Dialog.Description>
            <div className='flex flex-col gap-4 w-[500px] p-1'>
              <div>
                <div className='text-lg font-bold'>Name</div>
                <Input
                  name='name'
                  placeholder='Evaluation name'
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <div className='text-lg font-bold'>Description</div>
                <TextArea
                  name='description'
                  placeholder='Description'
                  value={formData.description}
                  onChange={handleTextAreaChange}
                />
              </div>
              <div>
                <div className='text-lg font-bold'>Category</div>
                <CustomSelect
                  data-test-id='CategoryDropdown'
                  name='category'
                  value={categoryOptions.find((option) => option.value === formData.category)}
                  onChange={(option) => setFormData({ ...formData, category: option?.value })}
                  options={categoryOptions}
                  fullWidth
                />
              </div>
              <div>
                <div className='text-lg font-bold'>Rate</div>
                <Input
                  step={0.01}
                  name='rate'
                  type='number'
                  placeholder='Rate'
                  value={Number(formData.rate).toFixed(2)}
                  onChange={(event) => checkNumberValue(event)}
                />
              </div>
              <div className='flex gap-3 items-center'>
                <div className='text-lg font-bold'>Active</div>
                <Checkbox
                  checked={Boolean(formData.is_active)}
                  onChange={() => {
                    const newValue: boolean = Boolean(formData.is_active) ?? false
                    setFormData({ ...formData, is_active: !newValue })
                    return null
                  }}
                />
              </div>
            </div>
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant='primaryOutline' onClick={() => toggleEditDialog(null)}>
              Close
            </Button>
            <Button
              variant='primary'
              onClick={async () => {
                await handleSave()
                toggleEditDialog(null)
              }}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </div>
    </>
  )
}
