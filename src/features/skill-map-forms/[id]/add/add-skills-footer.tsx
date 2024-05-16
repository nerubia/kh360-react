import { lazy, Suspense, useState } from "react"
import { useNavigate, useSearchParams, useParams } from "react-router-dom"
import { Button } from "@components/ui/button/button"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import {
  setSelectedUserSkills,
  setCheckedUserSkills,
  setHasSelected,
} from "@redux/slices/user-skills-slice"
import { setAlert } from "@redux/slices/app-slice"

export const AddSkillsFooter = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const { selectedUserSkills, checkedUserSkills } = useAppSelector((state) => state.userSkills)
  const callback = searchParams.get("callback")

  const SkillMapFormsDialog = lazy(
    async () => await import("@features/skill-map-forms/skill-map-forms-dialog")
  )

  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const handleCancel = () => {
    navigate(callback ?? `/skill-map-forms/${id}`)
    void appDispatch(setCheckedUserSkills(selectedUserSkills))
  }

  const handleAdd = () => {
    if (checkedUserSkills.length === 0) {
      appDispatch(
        setAlert({
          description: "Please select at least one skill.",
          variant: "destructive",
        })
      )
    } else {
      const newSkills = checkedUserSkills.map((skill) => ({
        ...skill,
        previous_rating: "No rating",
      }))
      const result = appDispatch(setSelectedUserSkills(newSkills))
      if (result.payload.length > 0) {
        appDispatch(setHasSelected(true))
        navigate(`/skill-map-forms/${id}`)
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
        <SkillMapFormsDialog
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
