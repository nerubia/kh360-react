import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@components/ui/button/button"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { setSelectedSkills, setCheckedSkills } from "@redux/slices/skills-slice"
import { setAlert } from "@redux/slices/app-slice"
import { setIsEditingProjectMember } from "@redux/slices/project-member-slice"

export const SelectProjectMemberSkillsFooter = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { selectedSkills, checkedSkills } = useAppSelector((state) => state.skills)
  const callback = searchParams.get("callback")
  const project_id = searchParams.get("project_id")

  useEffect(() => {
    void appDispatch(setIsEditingProjectMember(true))
  }, [])

  const handleCancel = () => {
    let navigateUrl = callback ?? "/admin/project-assignments"

    if (project_id !== null) {
      navigateUrl += `&project_id=${project_id}`
    }

    navigate(navigateUrl)
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
      return
    }

    const result = appDispatch(setSelectedSkills(checkedSkills))
    if (result.payload.length === 0) {
      return
    }

    let navigateUrl = callback ?? "/admin/project-assignments/create"
    if (project_id !== null) {
      navigateUrl += `&project_id=${project_id}`
    }

    navigate(navigateUrl)
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
