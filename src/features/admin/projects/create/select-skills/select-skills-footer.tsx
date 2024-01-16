import { useNavigate } from "react-router-dom"
import { Button } from "../../../../../components/ui/button/button"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../hooks/useAppSelector"
import { setSelectedSkills, setCheckedSkills } from "../../../../../redux/slices/skills-slice"
import { setAlert } from "../../../../../redux/slices/app-slice"

export const SelectSkillsFooter = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { selectedSkills, checkedSkills } = useAppSelector((state) => state.skills)
  const callback = `/admin/projects/create`

  const handleCancel = () => {
    navigate(callback)
    void appDispatch(setCheckedSkills(selectedSkills))
  }

  const handleAdd = () => {
    if (checkedSkills.length === 0) {
      appDispatch(
        setAlert({
          description: "Please select at least one skill.",
          variant: "destructive",
        })
      )
    } else {
      const result = appDispatch(setSelectedSkills(checkedSkills))
      if (result.payload.length > 0) {
        navigate(callback)
      }
    }
  }

  return (
    <>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={handleCancel}>
          Cancel
        </Button>
        <div className='flex items-center gap-2'>
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </div>
    </>
  )
}
