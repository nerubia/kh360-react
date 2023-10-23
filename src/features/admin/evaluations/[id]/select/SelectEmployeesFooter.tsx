import { useState } from "react"
import { useParams } from "react-router-dom"
import { getEmployees } from "../../../../../redux/slices/employeesSlice"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { Button, LinkButton } from "../../../../../components/button/Button"
import { Icon } from "../../../../../components/icon/Icon"
import Dialog from "../../../../../components/dialog/Dialog"

export const SelectEmployeesFooter = () => {
  const { id } = useParams()

  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showBackDialog, setShowBackDialog] = useState<boolean>(false)

  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const toggleBackDialog = () => {
    setShowBackDialog((prev) => !prev)
  }

  return (
    <>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleCancelDialog}>
          Cancel & Exit
        </Button>
        <div className='flex items-center gap-2'>
          <Button
            variant='primaryOutline'
            size='medium'
            onClick={toggleBackDialog}
          >
            <Icon icon='ChevronLeft' />
          </Button>
          <LinkButton to={`/admin/evaluations/${id}/preview`}>
            Check & Preview
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
          <LinkButton variant='primary' to='/admin/evaluations'>
            Yes
          </LinkButton>
        </Dialog.Actions>
      </Dialog>
      <Dialog open={showBackDialog}>
        <Dialog.Title>Go back to previous step</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to go back? <br />
          If you go back, your data won&apos;t be saved.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleBackDialog}>
            No
          </Button>
          <LinkButton variant='primary' to={`/admin/evaluations/${id}/edit`}>
            Yes
          </LinkButton>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
