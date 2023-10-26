import { useParams } from "react-router-dom"
import { useState } from "react"
import { Button, LinkButton } from "../../../../../components/button/Button"
import { Icon } from "../../../../../components/icon/Icon"
import Dialog from "../../../../../components/dialog/Dialog"

export const EvalueesFooter = () => {
  const { id } = useParams()

  const [showDialog, setShowDialog] = useState<boolean>(false)

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  return (
    <>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleDialog}>
          Cancel & Exit
        </Button>
        <div className='flex items-center gap-2'>
          <LinkButton
            testId='BackButton'
            variant='primaryOutline'
            to={`/admin/evaluation-administrations/${id}/select`}
          >
            <Icon icon='ChevronLeft' />
          </LinkButton>
          <Button variant='primaryOutline' disabled>
            Generate Evaluations
          </Button>
        </div>
      </div>
      <Dialog open={showDialog}>
        <Dialog.Title>Cancel & Exit</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to cancel and exit? <br />
          If you cancel, your data won&apos;t be saved.
        </Dialog.Description>
        <Dialog.Actions>
          <Button
            testId='DialogNoButton'
            variant='primaryOutline'
            onClick={toggleDialog}
          >
            No
          </Button>
          <LinkButton
            testId='DialogYesButton'
            variant='primary'
            to='/admin/evaluation-administrations'
          >
            Yes
          </LinkButton>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
