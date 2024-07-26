import { ValidationError } from "yup"
import { useState, useEffect, lazy, Suspense } from "react"
import { Input } from "@components/ui/input/input"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { type SkillCategoryFormData } from "@custom-types/form-data-type"
import { createSkillCategorySchema } from "@utils/validation/skill-category-schema"
import { ToggleSwitch } from "@components/ui/toggle-switch/toggle-switch"
import { TextArea } from "@components/ui/textarea/text-area"
import {
  createSkillCategory,
  updateSkillCategory,
  getSkillCategory,
} from "@redux/slices/skill-category-slice"
import { setAlert } from "@redux/slices/app-slice"
import { setSkillCategories } from "@redux/slices/skill-categories-slice"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { removeWhitespace } from "@hooks/remove-whitespace"

interface SkillCategoriesFormProps {
  open: boolean
  toggleDialog: () => void
}

export const SkillCategoriesForm = ({ open, toggleDialog }: SkillCategoriesFormProps) => {
  const appDispatch = useAppDispatch()

  const { skill_category, selectedSkillCategoryId } = useAppSelector((state) => state.skillCategory)
  const { skill_categories } = useAppSelector((state) => state.skillCategories)

  const defaultFormData = {
    name: "",
    description: "",
    status: true,
  }

  const [formData, setFormData] = useState<SkillCategoryFormData>(defaultFormData)
  const [validationErrors, setValidationErrors] = useState<Partial<SkillCategoryFormData>>({})
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const SkillCategoriesDialog = lazy(
    async () => await import("@features/admin/skill-categories/skill-categories-dialog")
  )

  useEffect(() => {
    setFormData(defaultFormData)
    setIsEditing(false)
    if (selectedSkillCategoryId !== null) {
      void appDispatch(getSkillCategory(selectedSkillCategoryId))
    }
    setValidationErrors({})
  }, [open])

  useEffect(() => {
    if (selectedSkillCategoryId !== null) {
      setFormData({
        name: skill_category?.name,
        description: skill_category?.description,
        status: skill_category?.status,
      })
    }
  }, [skill_category])

  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const handleSave = async () => {
    try {
      await createSkillCategorySchema.validate(formData, {
        abortEarly: false,
      })
      const parseFormData = {
        ...formData,
        name: removeWhitespace(formData.name as string),
      }
      const result = await appDispatch(createSkillCategory(parseFormData))
      if (result.type === "skillCategory/createSkillCategory/rejected") {
        setValidationErrors({
          name: result.payload,
        })
      }
      if (result.type === "skillCategory/createSkillCategory/fulfilled") {
        appDispatch(
          setAlert({
            description: "Added new skill category",
            variant: "success",
          })
        )
        setFormData(defaultFormData)
        toggleDialog()
        appDispatch(setSkillCategories([...skill_categories, result.payload]))
        setIsEditing(false)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<SkillCategoryFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof SkillCategoryFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const handleEdit = async () => {
    try {
      if (selectedSkillCategoryId !== null) {
        await createSkillCategorySchema.validate(formData, {
          abortEarly: false,
        })
        const parseFormData = {
          ...formData,
          name: removeWhitespace(formData.name as string),
        }
        const result = await appDispatch(
          updateSkillCategory({ id: selectedSkillCategoryId, skillCategory: parseFormData })
        )
        if (result.type === "skillCategory/updateSkillCategory/rejected") {
          setValidationErrors({
            name: result.payload,
          })
        }
        if (result.type === "skillCategory/updateSkillCategory/fulfilled") {
          appDispatch(
            setAlert({
              description: "Successfully updated skill category",
              variant: "success",
            })
          )
          toggleDialog()
          setFormData(defaultFormData)
          const updatedData = skill_categories.map((category) => {
            if (category.id === selectedSkillCategoryId) {
              return { id: category.id, ...formData }
            } else {
              return category
            }
          })
          void appDispatch(setSkillCategories(updatedData))
          setIsEditing(false)
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<SkillCategoryFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof SkillCategoryFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const onChangeActive = async (checked: boolean) => {
    setIsEditing(true)
    setFormData({ ...formData, status: checked })
  }

  const onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setIsEditing(true)
    setValidationErrors({})
    setFormData({ ...formData, [name]: value })
  }

  const onChangeTextArea = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setIsEditing(true)
    setFormData({ ...formData, [name]: value })
  }

  return (
    <>
      <div className='flex flex-col gap-8'>
        <CustomDialog
          open={open}
          title={selectedSkillCategoryId === null ? "Add Skill Category" : "Edit Skill Category"}
          size='small'
          description={
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
                  <TextArea
                    label='Description'
                    name='description'
                    placeholder='Description'
                    value={formData.description ?? ""}
                    onChange={onChangeTextArea}
                    error={validationErrors.description}
                  />
                </div>
                <div className='flex items-center'>
                  <div className='my-2.5'>
                    <ToggleSwitch
                      checked={Boolean(formData.status) ?? false}
                      onChange={async (checked) => await onChangeActive(checked)}
                    />
                  </div>
                  <h2 className='font-medium'>Active</h2>
                </div>
              </div>
            </div>
          }
          onClose={() => {
            if (isEditing) {
              toggleCancelDialog()
            } else {
              toggleDialog()
            }
          }}
          onSubmit={async () => {
            selectedSkillCategoryId === null ? await handleSave() : await handleEdit()
          }}
          closeButtonLabel='Cancel'
          submitButtonLabel='Save'
        />
      </div>
      <Suspense>
        <SkillCategoriesDialog
          open={showCancelDialog}
          title='Cancel'
          description={
            <>
              Are you sure you want to cancel? <br />
              If you cancel, your data will not be saved.
            </>
          }
          onClose={toggleCancelDialog}
          onSubmit={() => {
            toggleDialog()
            toggleCancelDialog()
          }}
        />
      </Suspense>
    </>
  )
}
