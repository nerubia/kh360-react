import { lazy, Suspense, useState } from "react"
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
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const { selectedSkills, checkedSkills } = useAppSelector((state) => state.skills)
  const callback = searchParams.get("callback")
  const project_name = searchParams.get("project_name")
  const id = searchParams.get("id")

  const ProjectsDialog = lazy(async () => await import("@features/admin/projects/projects-dialog"))

  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const handleCancel = () => {
    navigate(callback ?? `/admin/projects/create?hasEdited=true`)
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
        if (project_name !== null) {
          navigate(`/admin/projects/${id}/edit`)
        } else {
          navigate(callback ?? `/admin/projects/create`)
        }
      }
    }
  }

  return (
    <>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleCancelDialog}>
          Cancel
        </Button>
        <div className='flex items-center gap-2'>
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </div>
      <Suspense>
        <ProjectsDialog
          open={showCancelDialog}
          title='Cancel'
          description={
            <>
              Are you sure you want to cancel? <br />
              If you cancel, your data won&apos;t be saved.
            </>
          }
          onClose={toggleCancelDialog}
          onSubmit={handleCancel}
        />
      </Suspense>
    </>
  )
}
