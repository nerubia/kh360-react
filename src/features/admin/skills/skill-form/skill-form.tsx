import { ValidationError } from "yup"
import { useState, useEffect, lazy, Suspense } from "react"
import { Button } from "@components/ui/button/button"
import Dialog from "@components/ui/dialog/dialog"
import { Input } from "@components/ui/input/input"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { type SkillFormData } from "@custom-types/form-data-type"
import { createSkillSchema } from "@utils/validation/skill-schema"
import { ToggleSwitch } from "@components/ui/toggle-switch/toggle-switch"
import { TextArea } from "@components/ui/textarea/text-area"
import { createSkill, updateSkill, getSkill } from "@redux/slices/skill-slice"
import { setAlert } from "@redux/slices/app-slice"
import { setSkills } from "@redux/slices/skills-slice"
import { type SingleValue } from "react-select"
import { CustomSelect } from "@components/ui/select/custom-select"
import { type Option } from "@custom-types/optionType"
import { Loading } from "@custom-types/loadingType"

interface SkillFormProps {
  open: boolean
  toggleDialog: () => void
}

export const SkillForm = ({ open, toggleDialog }: SkillFormProps) => {
  const appDispatch = useAppDispatch()

  const { loading, skill, selectedSkillId } = useAppSelector((state) => state.skill)
  const { skills } = useAppSelector((state) => state.skills)
  const { skill_categories } = useAppSelector((state) => state.skillCategories)

  const defaultFormData = {
    name: "",
    description: "",
    status: true,
    skill_category_id: undefined,
  }

  const [formData, setFormData] = useState<SkillFormData>(defaultFormData)
  const [validationErrors, setValidationErrors] = useState<Partial<SkillFormData>>({})
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([])

  const SkillsDialog = lazy(async () => await import("@features/admin/skills/skills-dialog"))

  useEffect(() => {
    setFormData(defaultFormData)
    setIsEditing(false)
    if (selectedSkillId !== null) {
      void appDispatch(getSkill(selectedSkillId))
    }
    setValidationErrors({})
  }, [open])

  useEffect(() => {
    if (selectedSkillId !== null) {
      setFormData({
        name: skill?.name,
        description: skill?.description,
        status: skill?.status,
        skill_category_id: skill?.skill_category_id.toString(),
      })
    }
  }, [skill])

  useEffect(() => {
    const filterOptions: Option[] = skill_categories.map((category) => ({
      label: category.name ?? "",
      value: category.id.toString() ?? "",
    }))
    setCategoryOptions(filterOptions)
  }, [skill_categories])

  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const handleSave = async () => {
    try {
      await createSkillSchema.validate(formData, {
        abortEarly: false,
      })
      const result = await appDispatch(createSkill(formData))
      if (result.type === "skill/createSkill/rejected") {
        setValidationErrors({
          name: result.payload,
        })
      }
      if (result.type === "skill/createSkill/fulfilled") {
        appDispatch(
          setAlert({
            description: "Added new skill category",
            variant: "success",
          })
        )
        const updatedSkills = [...skills, result.payload]

        updatedSkills.sort((a, b) => {
          const nameA = a.name.toLowerCase()
          const nameB = b.name.toLowerCase()
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          return 0
        })

        appDispatch(setSkills(updatedSkills))
        setFormData(defaultFormData)
        toggleDialog()
        setIsEditing(false)
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<SkillFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof SkillFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const handleEdit = async () => {
    try {
      if (selectedSkillId !== null) {
        await createSkillSchema.validate(formData, {
          abortEarly: false,
        })
        const result = await appDispatch(
          updateSkill({ id: selectedSkillId, skillCategory: formData })
        )
        if (result.type === "skill/updateSkill/rejected") {
          setValidationErrors({
            name: result.payload,
          })
        }
        if (result.type === "skill/updateSkill/fulfilled") {
          appDispatch(
            setAlert({
              description: "Successfully updated skill",
              variant: "success",
            })
          )
          toggleDialog()
          setFormData(defaultFormData)
          const updatedData = skills.map((skill) => {
            if (skill.id === selectedSkillId) {
              return result.payload
            } else {
              return skill
            }
          })
          void appDispatch(setSkills(updatedData))
          setIsEditing(false)
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<SkillFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof SkillFormData] = err.message
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

  const onChangeCategory = async (option: SingleValue<Option>) => {
    const category: string = option !== null ? option.value : ""
    setFormData({ ...formData, skill_category_id: category })
  }

  const onChangeTextArea = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setIsEditing(true)
    setFormData({ ...formData, [name]: value })
  }

  return (
    <>
      <div className='flex flex-col gap-8'>
        <Dialog open={open} size='small'>
          <Dialog.Title>{selectedSkillId === null ? "Add Skill" : "Edit Skill"}</Dialog.Title>
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
                  <CustomSelect
                    data-test-id='SelectCategory'
                    label='Category'
                    name='category'
                    value={categoryOptions.find(
                      (option) => option.value === formData?.skill_category_id
                    )}
                    onChange={async (option) => await onChangeCategory(option)}
                    options={categoryOptions}
                    fullWidth
                    error={validationErrors.skill_category_id}
                    maxMenuHeight={160}
                    isClearable
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
          </Dialog.Description>
          <Dialog.Actions>
            <Button
              variant='primaryOutline'
              onClick={() => {
                if (isEditing) {
                  toggleCancelDialog()
                } else {
                  toggleDialog()
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={async () => {
                selectedSkillId === null ? await handleSave() : await handleEdit()
              }}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </div>
      <Suspense>
        <SkillsDialog
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
          loading={loading === Loading.Pending}
        />
      </Suspense>
    </>
  )
}
