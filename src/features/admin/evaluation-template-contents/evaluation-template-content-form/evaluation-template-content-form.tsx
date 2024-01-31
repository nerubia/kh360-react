import { ValidationError } from "yup"
import { useState, useEffect } from "react"
import { Button } from "@components/ui/button/button"
import { Checkbox } from "@components/ui/checkbox/checkbox"
import Dialog from "@components/ui/dialog/dialog"
import { Input } from "@components/ui/input/input"
import { CustomSelect } from "@components/ui/select/custom-select"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import {
  showCreateModal,
  setEvaluationTemplateContents,
} from "@redux/slices/evaluation-template-contents-slice"
import { EvaluationTemplateContentCategory } from "@custom-types/evaluation-template-content-type"
import { type Option } from "@custom-types/optionType"
import { type EvaluationTemplateContentFormData } from "@custom-types/form-data-type"
import { createEvaluationTemplateContentSchema } from "@utils/validation/evaluation-template-content-schema"
import { type SingleValue } from "react-select"
import { type EvaluationTemplateContent } from "@custom-types/evaluation-template-content-type"

export const CreateEvaluationTemplateContentForm = () => {
  const appDispatch = useAppDispatch()

  const { create_modal_visible, evaluation_template_contents, selected_content_index } =
    useAppSelector((state) => state.evaluationTemplateContents)
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
  const [selectedTemplateContent, setSelectedEvaluationTemplateContent] =
    useState<EvaluationTemplateContent | null>(null)

  useEffect(() => {
    setValidationErrors({})
    const evaluationTemplateContent = evaluation_template_contents.find(
      (_, index) => index === selected_content_index
    )
    if (evaluationTemplateContent !== undefined) {
      setSelectedEvaluationTemplateContent(evaluationTemplateContent)
      setFormData(evaluationTemplateContent)
    } else {
      setFormData(defaultFormData)
      setSelectedEvaluationTemplateContent(null)
    }
  }, [create_modal_visible])

  const categoryOptions: Option[] = Object.values(EvaluationTemplateContentCategory).map(
    (value) => ({
      label: value,
      value,
    })
  )

  const handleSave = async () => {
    try {
      await createEvaluationTemplateContentSchema.validate(formData, {
        abortEarly: false,
      })
      void appDispatch(setEvaluationTemplateContents([...evaluation_template_contents, formData]))
      setFormData({})
      void appDispatch(showCreateModal(!create_modal_visible))
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

  const handleEdit = async () => {
    try {
      await createEvaluationTemplateContentSchema.validate(formData, {
        abortEarly: false,
      })
      const updatedData = evaluation_template_contents.map((content, index) => {
        if (index === selected_content_index) {
          return formData
        } else {
          return content
        }
      })
      void appDispatch(setEvaluationTemplateContents(updatedData))
      setFormData({})
      void appDispatch(showCreateModal(!create_modal_visible))
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
    setFormData({})
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
                  value={formData.name ?? ""}
                  onChange={onChangeInput}
                  error={validationErrors.name}
                />
              </div>
              <div className='flex-1'>
                <Input
                  label='Description'
                  name='description'
                  placeholder='Description'
                  value={formData.description ?? ""}
                  onChange={onChangeInput}
                  error={validationErrors.description}
                />
              </div>
              <div className='flex-1'>
                <CustomSelect
                  data-test-id='SelectCategory'
                  label='Category'
                  name='category'
                  value={categoryOptions.find((option) => option.value === formData.category ?? "")}
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
                  value={formData.rate ?? ""}
                  onChange={onChangeInput}
                  error={validationErrors.rate}
                  type='number'
                  min={0}
                  max={100}
                />
              </div>
              <div className='flex gap-3 items-center'>
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
          <Button
            variant='primary'
            onClick={selectedTemplateContent === null ? handleSave : handleEdit}
          >
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  )
}
