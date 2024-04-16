import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { getSkillMapAdmin, setSelectedEmployeeIds } from "@redux/slices/skill-map-admin-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { setSkillMapResults } from "@redux/slices/skill-map-results-slice"
import { SkillMapAdminStatus } from "@custom-types/skill-map-admin-type"

export const SelectEmployeesFooter = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { skill_map_admin, selectedEmployeeIds } = useAppSelector(
    (state) => state.skillMapAdministration
  )

  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showBackDialog, setShowBackDialog] = useState<boolean>(false)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getSkillMapAdmin(parseInt(id)))
    }
  }, [])

  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const toggleBackDialog = () => {
    setShowBackDialog((prev) => !prev)
  }

  const handleGoBack = () => {
    appDispatch(setSelectedEmployeeIds([]))
    navigate(`/admin/skill-map-administrations/${id}/edit`)
  }

  const handleCancelAndExit = () => {
    appDispatch(setSelectedEmployeeIds([]))
    appDispatch(setSkillMapResults([]))
    navigate(`/admin/skill-map-administrations/${id}`)
  }

  const handleCheckAndReview = () => {
    navigate(`/admin/skill-map-administrations/${id}/preview`)
  }

  return (
    <>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleCancelDialog}>
          Cancel & Exit
        </Button>
        <div className='flex items-center gap-2'>
          {skill_map_admin?.status !== SkillMapAdminStatus.Ongoing && (
            <Button
              testId='BackButton'
              variant='primaryOutline'
              size='medium'
              onClick={toggleBackDialog}
            >
              <Icon icon='ChevronLeft' />
            </Button>
          )}
          <Button onClick={handleCheckAndReview} disabled={selectedEmployeeIds.length === 0}>
            Check & Review
          </Button>
        </div>
      </div>
      <CustomDialog
        open={showCancelDialog}
        title='Cancel & Exit'
        description={
          <>
            Are you sure you want to cancel and exit? <br />
            If you cancel, your data won&apos;t be saved.
          </>
        }
        onClose={toggleCancelDialog}
        onSubmit={handleCancelAndExit}
      />
      <CustomDialog
        open={showBackDialog}
        title='Go Back'
        description={
          <>
            Are you sure you want to go back? <br />
            If you go back, your data won&apos;t be saved.
          </>
        }
        onClose={toggleBackDialog}
        onSubmit={handleGoBack}
      />
    </>
  )
}
