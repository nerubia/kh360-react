import { Suspense, lazy, useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { Loading } from "@custom-types/loadingType"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import {
  createEvaluationTemplateContent,
  deleteEvaluationTemplateContent,
  updateEvaluationTemplateContent,
} from "@redux/slices/evaluation-template-content-slice"
import {
  removeEvaluationTemplateContent,
  setEvaluationTemplateContent,
  addEvaluationTemplateContent,
} from "@redux/slices/evaluation-template-slice"
import { setAlert } from "@redux/slices/app-slice"
import { type EvaluationTemplateContentFormData } from "@custom-types/form-data-type"
import { Input } from "@components/ui/input/input"
import { TextArea } from "@components/ui/textarea/text-area"
import { CustomSelect } from "@components/ui/select/custom-select"
import { type Option } from "@custom-types/optionType"
import { EvaluationTemplateContentCategory } from "@custom-types/evaluation-template-content-type"
import { Badge } from "@components/ui/badge/badge"
import { createEvaluationTemplateContentSchema } from "@utils/validation/evaluation-template-content-schema"
import { ValidationError } from "yup"
import { ToggleSwitch } from "@components/ui/toggle-switch/toggle-switch"
import { type EvaluationTemplate } from "@custom-types/evaluation-template-type"
import { removeWhitespace } from "@hooks/remove-whitespace"

const categoryOptions: Option[] = Object.values(EvaluationTemplateContentCategory).map((value) => ({
  label: value,
  value,
}))

const EvaluationTemplateDialog = lazy(
  async () => await import("@features/admin/evaluation-templates/evaluation-templates-dialog")
)

export const ViewEvaluationTemplateTable = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, evaluation_template } = useAppSelector((state) => state.evaluationTemplate)
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [selectedEvaluationTemplateContentId, setSelectedEvaluationTemplateContentId] = useState<
    number | null
  >(null)
  const [evaluationTemplate, setEvaluationTemplate] = useState<EvaluationTemplate>()
  const [formData, setFormData] = useState<EvaluationTemplateContentFormData>({
    name: "",
    description: "",
    category: "",
    rate: "",
    is_active: false,
  })
  const [validationErrors, setValidationErrors] = useState<
    Partial<EvaluationTemplateContentFormData>
  >({})

  useEffect(() => {
    if (evaluation_template?.evaluationTemplateContents !== undefined) {
      evaluation_template?.evaluationTemplateContents.map((content) => {
        return setCheckedItems((prevItems) => ({
          ...prevItems,
          [content.id]: content.is_active ?? false,
        }))
      })

      const templateContentsCopy = [...evaluation_template.evaluationTemplateContents]
      const sortedContents = templateContentsCopy.sort(
        (a, b) => (a.sequence_no ?? 0) - (b.sequence_no ?? 0)
      )

      setEvaluationTemplate({ ...evaluation_template, evaluationTemplateContents: sortedContents })
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
      } else {
        setSelectedEvaluationTemplateContentId(null)
        setFormData({})
      }
    }
    setValidationErrors({})
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
    setFormData({ ...formData, rate: handleDecimalsOnValue(inputValue) })
  }

  const handleDecimalsOnValue = (value: string) => {
    const regex = /([0-9]*[.|,]{0,1}[0-9]{0,2})/s
    const matchResult = value.match(regex)

    if (matchResult !== null) {
      const parsedValue = parseFloat(matchResult[0].replace(",", "."))
      if (!isNaN(parsedValue) && parsedValue <= 100) {
        return matchResult[0]
      }
    }
    if (value.length === 0) {
      return ""
    }
    return formData.rate
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
    if (
      selectedEvaluationTemplateContentId !== undefined &&
      selectedEvaluationTemplateContentId !== null
    ) {
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
      if (
        selectedEvaluationTemplateContentId !== undefined &&
        selectedEvaluationTemplateContentId !== null
      ) {
        try {
          const parseFormData = {
            ...formData,
            name: removeWhitespace(formData.name as string),
          }
          await createEvaluationTemplateContentSchema.validate(parseFormData, {
            abortEarly: false,
          })
          const result = await appDispatch(
            updateEvaluationTemplateContent({
              id: selectedEvaluationTemplateContentId,
              evaluation_template_contents_data: parseFormData,
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
            toggleEditDialog(null)
            setFormData({})
          }
        } catch (error) {}
      }
      setSelectedEvaluationTemplateContentId(null)
    }
  }

  const handleAddContent = async () => {
    try {
      await createEvaluationTemplateContentSchema.validate(formData, {
        abortEarly: false,
      })
      const result = await appDispatch(
        createEvaluationTemplateContent({ ...formData, evaluation_template_id: id })
      )
      if (result.type === "evaluationTemplateContent/createEvaluationTemplateContent/fulfilled") {
        setFormData({})
        toggleEditDialog(null)
        appDispatch(addEvaluationTemplateContent(result.payload))
      }
      if (result.type === "evaluationTemplateContent/createEvaluationTemplateContent/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Record<string, string> = {}
        error.inner.forEach((err) => {
          if (err.path != null) {
            errors[err.path] = err.message
          }
        })
        setValidationErrors(errors)
      }
    }
  }

  return (
    <>
      <div className='flex-1 flex flex-col gap-5 overflow-y-scroll'>
        <div className='text-xl text-primary-500 font-bold'>Evaluation Template Contents </div>
        {loading === Loading.Pending && <div>Loading...</div>}
        {loading === Loading.Fulfilled &&
          evaluationTemplate?.evaluationTemplateContents === null && <div>Not found</div>}
        <div className='overflow-y-scroll'>
          {loading === Loading.Fulfilled &&
            evaluationTemplate?.evaluationTemplateContents !== undefined &&
            evaluationTemplate?.evaluationTemplateContents.length > 0 &&
            id !== undefined && (
              <>
                <table>
                  <thead className='text-left'>
                    <tr>
                      <th className='p-2 border-b-4 text-primary-500 md:w-1/4'>Name</th>
                      <th className='p-2 border-b-4 text-start text-primary-500 md:w-1/2'>
                        Description
                      </th>
                      <th className='p-2 border-b-4 text-start text-primary-500 md:w-1/8'>Rate</th>
                      <th className='p-2 border-b-4 text-center text-primary-500 md:w-1/6'>
                        Status
                      </th>
                      <th className='p-2 border-b-4 text-center text-primary-500 md:w-1/2'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationTemplate?.evaluationTemplateContents.map((content) => (
                      <tr key={content.id} className='hover:bg-slate-100'>
                        <td className='p-2 border-b'>
                          <div className='flex gap-4 items-center'>
                            <Badge
                              variant={`${
                                content.category ===
                                EvaluationTemplateContentCategory.PrimarySkillSet
                                  ? "darkPurple"
                                  : "primary"
                              }`}
                              size='iconSize'
                            >
                              {content.category ===
                              EvaluationTemplateContentCategory.PrimarySkillSet
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
                          <div className='flex items-center justify-center'>
                            <Badge
                              variant={`${checkedItems[content.id] ? "green" : "gray"}`}
                              size='small'
                            >
                              {checkedItems[content.id] ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                          </div>
                        </td>
                        <td className='p-2 border-b text-center items-center md:w-1/2'>
                          <div className='flex gap-2 justify-center'>
                            <Button
                              testId={`EditButton${content.id}`}
                              variant='unstyled'
                              onClick={() => toggleEditDialog(content.id)}
                            >
                              <Icon icon='PenSquare' size='extraSmall' color='gray' />
                            </Button>
                            <Button
                              testId={`DeleteButton${content.id}`}
                              variant='unstyled'
                              onClick={() => toggleDeleteDialog(content.id)}
                            >
                              <Icon icon='Trash' size='extraSmall' color='gray' />
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
        <Suspense>
          <EvaluationTemplateDialog
            open={showDeleteDialog}
            title='Delete Evaluation Template Content'
            description={
              <>
                Are you sure you want to delete this evaluation template content? This will delete
                all data and cannot be reverted.
              </>
            }
            onClose={() => toggleDeleteDialog(null)}
            onSubmit={async () => {
              await handleDelete()
              toggleDeleteDialog(null)
            }}
            closeBtn='No'
            acceptBtn='Yes'
          />
          <EvaluationTemplateDialog
            size={"medium"}
            maxWidthMin={true}
            open={showEditDialog}
            title={
              selectedEvaluationTemplateContentId !== null
                ? "Edit Evaluation Template Content"
                : "Add Evaluation Template Content"
            }
            description={
              <>
                <div className='flex flex-col gap-4 w-500 p-1'>
                  <div>
                    <div className='text-lg font-bold'>Name</div>
                    <Input
                      name='name'
                      placeholder='Evaluation name'
                      value={formData.name}
                      onChange={handleInputChange}
                      error={validationErrors.name}
                    />
                  </div>
                  <div>
                    <div className='text-lg font-bold'>Description</div>
                    <TextArea
                      name='description'
                      placeholder='Description'
                      value={formData.description}
                      onChange={handleTextAreaChange}
                      error={validationErrors.description}
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
                      error={validationErrors.category}
                    />
                  </div>
                  <div>
                    <div className='text-lg font-bold'>Rate</div>
                    <Input
                      step={0.01}
                      name='rate'
                      type='number'
                      placeholder='Rate'
                      value={formData.rate}
                      onChange={(event) => checkNumberValue(event)}
                      error={validationErrors.rate}
                    />
                  </div>
                  <div className='flex items-center'>
                    <ToggleSwitch
                      checked={Boolean(formData.is_active)}
                      onChange={() => {
                        const newValue: boolean = Boolean(formData.is_active) ?? false
                        setFormData({ ...formData, is_active: !newValue })
                        return null
                      }}
                    />
                    <div className='text-lg font-bold'>Active</div>
                  </div>
                </div>
              </>
            }
            closeBtn='Close'
            acceptBtn='Save'
            onClose={() => toggleEditDialog(null)}
            onSubmit={async () => {
              selectedEvaluationTemplateContentId !== null
                ? await handleSave()
                : await handleAddContent()
            }}
          />
        </Suspense>
        <div className='flex justify-end'>
          <Button onClick={() => toggleEditDialog(null)}>Add Template Content</Button>
        </div>
      </div>
    </>
  )
}
