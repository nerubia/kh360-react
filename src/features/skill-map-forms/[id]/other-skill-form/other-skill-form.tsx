import { Button } from "@components/ui/button/button"
import Dialog from "@components/ui/dialog/dialog"
import { Input } from "@components/ui/input/input"
import { type SkillFormData } from "@custom-types/form-data-type"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { setOtherSkills } from "@redux/slices/user-slice"
import { createOtherSkillSchema } from "@utils/validation/other-skill-schema"
import { useState } from "react"
import { ValidationError } from "yup"

interface OtherSkillFormDialogProps {
  open: boolean
  toggleDialog: () => void
}

const defaultFormData = {
  other_skill_name: "",
}

export const OtherSkillFormDialog = ({ open, toggleDialog }: OtherSkillFormDialogProps) => {
  const appDispatch = useAppDispatch()
  const { other_skills } = useAppSelector((state) => state.user)

  const [formData, setFormData] = useState<SkillFormData>(defaultFormData)
  const [validationErrors, setValidationErrors] = useState<Partial<SkillFormData>>({})

  const onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValidationErrors({})
    setFormData({ ...formData, [name]: value })
  }

  const generateUniqueID = () => {
    const timeStamp = Date.now()
    const randNumber = Math.floor(Math.random() * 1000)
    return `${timeStamp}${randNumber}`
  }

  const handleAdd = async () => {
    try {
      await createOtherSkillSchema.validate(formData, {
        abortEarly: false,
      })

      const trimmedFormData = {
        ...formData,
        other_skill_name: (formData.other_skill_name ?? "").trim(),
      }

      const newId = generateUniqueID()
      void appDispatch(
        setOtherSkills([
          ...other_skills,
          {
            skill_rating_id: newId,
            ...trimmedFormData,
          },
        ])
      )
      setFormData(defaultFormData)
      toggleDialog()
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

  return (
    <Dialog open={open} size='small'>
      <Dialog.Title>Add Other Skill</Dialog.Title>
      <Dialog.Description>
        <div className='flex flex-col gap-10'>
          <div className='flex flex-col gap-4 p-1'>
            <div className='flex-1'>
              <Input
                label='Name'
                name='other_skill_name'
                placeholder='Name'
                value={formData.other_skill_name ?? ""}
                onChange={onChangeInput}
                error={validationErrors.other_skill_name}
              />
            </div>
          </div>
        </div>
      </Dialog.Description>
      <Dialog.Actions>
        <Button variant='primaryOutline' onClick={() => toggleDialog()}>
          Cancel
        </Button>
        <Button variant='primary' onClick={handleAdd}>
          Save
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
