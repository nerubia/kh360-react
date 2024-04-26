import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  getSkillMapAdmin,
  setSelectedEmployeeIds,
} from "@redux/slices/skill-map-administration-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { setSkillMapResults } from "@redux/slices/skill-map-results-slice"
import { SelectUsersFooter } from "@components/shared/select-users/select-users-footer"

export const SelectEmployeesFooter = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { skill_map_administration, selectedEmployeeIds } = useAppSelector(
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
    <SelectUsersFooter
      administration={skill_map_administration != null ? [skill_map_administration] : []}
      selectedEmployeeIds={selectedEmployeeIds}
      onCancel={toggleCancelDialog}
      onGoBack={toggleBackDialog}
      cancelDialogOpen={showCancelDialog}
      backDialogOpen={showBackDialog}
      cancelDialogDescription={
        <>
          Are you sure you want to cancel and exit? <br />
          If you cancel, your data won&apos;t be saved.
        </>
      }
      backDialogDescription={
        <>
          Are you sure you want to go back? <br />
          If you go back, your data won&apos;t be saved.
        </>
      }
      onCancelDialogClose={toggleCancelDialog}
      onBackDialogClose={toggleBackDialog}
      onCancelSubmit={handleCancelAndExit}
      onBackSubmit={handleGoBack}
      handleCheckAndReview={handleCheckAndReview}
    />
  )
}
