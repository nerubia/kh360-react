import { useEffect, useState } from "react"
import { SelectUsersFooter } from "@components/shared/select-users/select-users-footer"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import {
  getEvaluationAdministration,
  setSelectedEmployeeIds,
} from "@redux/slices/evaluation-administration-slice"
import { setEvaluationResults } from "@redux/slices/evaluation-results-slice"

export const SelectEvalueesFooter = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { evaluation_administration, selectedEmployeeIds } = useAppSelector(
    (state) => state.evaluationAdministration
  )

  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showBackDialog, setShowBackDialog] = useState<boolean>(false)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluationAdministration(parseInt(id)))
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
    navigate(`/admin/evaluation-administrations/${id}/edit`)
  }

  const handleCancelAndExit = () => {
    appDispatch(setSelectedEmployeeIds([]))
    appDispatch(setEvaluationResults([]))
    navigate(`/admin/evaluation-administrations/${id}`)
  }

  const handleCheckAndReview = () => {
    navigate(`/admin/evaluation-administrations/${id}/preview`)
  }

  return (
    <>
      <SelectUsersFooter
        administration={evaluation_administration != null ? [evaluation_administration] : []}
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
    </>
  )
}
