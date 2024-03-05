import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import {
  getEvaluationAdministration,
  setSelectedEmployeeIds,
} from "@redux/slices/evaluation-administration-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { setEvaluationResults } from "@redux/slices/evaluation-results-slice"
import { EvaluationAdministrationStatus } from "@custom-types/evaluation-administration-type"

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
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleCancelDialog}>
          Cancel & Exit
        </Button>
        <div className='flex items-center gap-2'>
          {evaluation_administration?.status !== EvaluationAdministrationStatus.Ongoing && (
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
