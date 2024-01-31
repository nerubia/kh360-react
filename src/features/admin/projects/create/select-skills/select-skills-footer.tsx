import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@components/ui/button/button"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { setSelectedSkills, setCheckedSkills } from "@redux/slices/skills-slice"
import { setAlert } from "@redux/slices/app-slice"

export const SelectSkillsFooter = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { selectedSkills, checkedSkills } = useAppSelector((state) => state.skills)
  const callback = searchParams.get("callback")

  const handleCancel = () => {
    navigate(callback ?? `/admin/projects/create`)
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
        navigate(callback ?? `/admin/projects/create`)
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
