import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  getSurveyAdministration,
  setSelectedEmployeeIds,
} from "@redux/slices/survey-administration-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { setEvaluationResults } from "@redux/slices/evaluation-results-slice"
import { SelectUsersFooter } from "@components/shared/select-users/select-users-footer"

export const SelectRespondentsFooter = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { survey_administration, selectedEmployeeIds } = useAppSelector(
    (state) => state.surveyAdministration
  )

  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showBackDialog, setShowBackDialog] = useState<boolean>(false)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getSurveyAdministration(parseInt(id)))
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
    navigate(`/admin/survey-administrations/${id}/edit`)
  }

  const handleCancelAndExit = () => {
    appDispatch(setSelectedEmployeeIds([]))
    appDispatch(setEvaluationResults([]))
    navigate(`/admin/survey-administrations/${id}`)
  }

  const handleCheckAndReview = () => {
    navigate(`/admin/survey-administrations/${id}/preview`)
  }

  return (
    <>
      <SelectUsersFooter
        administration={survey_administration != null ? [survey_administration] : []}
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
