import { ValidationError } from "yup"
import { Button } from "../../../../components/ui/button/button"
import { Checkbox } from "../../../../components/ui/checkbox/checkbox"
import Dialog from "../../../../components/ui/dialog/dialog"
import { Input } from "../../../../components/ui/input/input"
import { CustomSelect } from "../../../../components/ui/select/custom-select"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { showCreateModal } from "../../../../redux/slices/evaluation-template-contents-slice"
import { EvaluationTemplateContentCategory } from "../../../../types/evaluation-template-content-type"
import { type Option } from "../../../../types/optionType"
import { type EvaluationTemplateContentFormData } from "../../../../types/form-data-type"
import { useState } from "react"
import { createEvaluationTemplateContentSchema } from "../../../../utils/validation/evaluation-template-content-schema"
import { type SingleValue } from "react-select"
import { createEvaluationTemplateContent } from "../../../../redux/slices/evaluation-template-content-slice"
import { setAlert } from "../../../../redux/slices/app-slice"

export const CreateEvaluationTemplateContentForm = () => {
  const appDispatch = useAppDispatch()

  const { create_modal_visible } = useAppSelector((state) => state.evaluationTemplateContents)

  const defaultFormData = {
    name: "",
    description: "",
    category: "",
    rate: "",
    is_active: false,
  }

  const [formData, setFormData] = useState<EvaluationTemplateContentFormData>(defaultFormData)
  const [validationErrors, setValidationErrors] = useState<
    Partial<EvaluationTemplateContentFormData>
  >({})

  const categoryOptions: Option[] = Object.values(EvaluationTemplateContentCategory).map(
    (value) => ({
      label: value,
      value,
    })
  )

  const handeSave = async () => {
    try {
      await createEvaluationTemplateContentSchema.validate(formData, {
        abortEarly: false,
      })

      const result = await appDispatch(createEvaluationTemplateContent(formData))
      if (result.type === "evaluationTemplate/createEvaluationTemplateContent/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
      if (result.type === "evaluationTemplate/createEvaluationTemplateContent/fulfilled") {
        toggleModalForm()
        setFormData(defaultFormData)
        appDispatch(
          setAlert({
            description: "Added new evaluation template content",
            variant: "success",
          })
        )
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<EvaluationTemplateContentFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof EvaluationTemplateContentFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const onChangeActive = async (checked: boolean) => {
    setFormData({ ...formData, is_active: checked })
  }

  const onChangeCategory = async (option: SingleValue<Option>) => {
    const category: string = option !== null ? option.value : ""
    setFormData({ ...formData, category })
  }

  const onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const toggleModalForm = () => {
    void appDispatch(showCreateModal(!create_modal_visible))
  }

  return (
    <div className='flex flex-col gap-8'>
      <Dialog open={create_modal_visible} size='medium'>
        <Dialog.Title>Add Template Content</Dialog.Title>
        <Dialog.Description>
          <div className='flex flex-col gap-10'>
            <div className='flex flex-col gap-4 p-1'>
              <div className='flex-1'>
                <Input
                  label='Name'
                  name='name'
                  placeholder='Name'
                  value={formData.name}
                  onChange={onChangeInput}
                  error={validationErrors.name}
                />
              </div>
              <div className='flex-1'>
                <Input
                  label='Description'
                  name='description'
                  placeholder='Description'
                  value={formData.description}
                  onChange={onChangeInput}
                  error={validationErrors.description}
                />
              </div>
              <div className='flex-1'>
                <CustomSelect
                  data-test-id='SelectCategory'
                  label='Category'
                  name='category'
                  value={categoryOptions.find((option) => option.value === formData.category)}
                  onChange={async (option) => await onChangeCategory(option)}
                  options={categoryOptions}
                  fullWidth
                  error={validationErrors.category}
                />
              </div>
              <div className='flex-1'>
                <Input
                  label='Rate'
                  name='rate'
                  placeholder='Rate'
                  value={formData.rate}
                  onChange={onChangeInput}
                  error={validationErrors.rate}
                  type='number'
                  min={0}
                  max={100}
                />
              </div>
              <div className='flex-1'>
                <h2 className='font-medium'>Active</h2>
                <div className='m-2.5'>
                  <Checkbox
                    checked={Boolean(formData.is_active) ?? false}
                    onChange={async (checked) => await onChangeActive(checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleModalForm}>
            Cancel
          </Button>
          <Button variant='primary' onClick={async () => await handeSave()}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  )
}
