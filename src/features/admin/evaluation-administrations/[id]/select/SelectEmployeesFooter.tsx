import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, LinkButton } from "../../../../../components/button/Button"
import { Icon } from "../../../../../components/icon/Icon"
import Dialog from "../../../../../components/dialog/Dialog"
import { setSelectedEmployeeIds } from "../../../../../redux/slices/evaluationAdministrationSlice"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"

export const SelectEmployeesFooter = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
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
          <LinkButton to={`/admin/evaluation-administrations/${id}/preview`}>
            Check & Review
          </LinkButton>
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
        <Dialog.Title>Go back</Dialog.Title>
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
