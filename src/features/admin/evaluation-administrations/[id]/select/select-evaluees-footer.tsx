import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../../../../../components/ui/button/button"
import { Icon } from "../../../../../components/ui/icon/icon"
import Dialog from "../../../../../components/ui/dialog/dialog"
import { setSelectedEmployeeIds } from "../../../../../redux/slices/evaluation-administration-slice"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../hooks/useAppSelector"

export const SelectEvalueesFooter = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluationAdministration)

  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showBackDialog, setShowBackDialog] = useState<boolean>(false)

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
    navigate(`/admin/evaluation-administrations`)
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
          <Button
            testId='BackButton'
            variant='primaryOutline'
            size='medium'
            onClick={toggleBackDialog}
          >
            <Icon icon='ChevronLeft' />
          </Button>
          <Button onClick={handleCheckAndReview} disabled={selectedEmployeeIds.length === 0}>
            Check & Review
          </Button>
        </div>
      </div>
      <Dialog open={showCancelDialog}>
        <Dialog.Title>Cancel & Exit</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to cancel and exit? <br />
          If you cancel, your data won&apos;t be saved.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleCancelDialog}>
            No
          </Button>
          <Button variant='primary' onClick={handleCancelAndExit}>
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog open={showBackDialog}>
        <Dialog.Title>Go Back</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to go back? <br />
          If you go back, your data won&apos;t be saved.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleBackDialog}>
            No
          </Button>
          <Button variant='primary' onClick={handleGoBack}>
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
