import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../hooks/useAppSelector"
import { Button, LinkButton } from "../../../../../components/button/Button"
import { Icon } from "../../../../../components/icon/Icon"
import Dialog from "../../../../../components/dialog/Dialog"
import { createEvaluees } from "../../../../../redux/slices/evaluationSlice"
import { setAlert } from "../../../../../redux/slices/appSlice"

export const PreviewEmployeesFooter = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showDialog, setShowDialog] = useState<boolean>(false)

  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluation)

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  const handleSubmit = async () => {
    try {
      const result = await appDispatch(
        createEvaluees({
          id,
          employee_ids: selectedEmployeeIds,
        })
      )
      if (typeof result.payload === "string") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      } else if (result.payload !== undefined) {
        navigate(`/admin/evaluations/${id}/evaluees`)
      }
    } catch (error) {}
  }

  return (
    <>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleDialog}>
          Cancel & Exit
        </Button>
        <div className='flex items-center gap-2'>
          <LinkButton
            variant='primaryOutline'
            size='medium'
            to={`/admin/evaluations/${id}/select`}
          >
            <Icon icon='ChevronLeft' />
          </LinkButton>
          <div className='ml-2'></div>
          <Button onClick={handleSubmit}>Save & Proceed</Button>
        </div>
        <Dialog open={showDialog}>
          <Dialog.Title>Cancel & Exit</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to cancel and exit? <br />
            If you cancel, your data won&apos;t be saved.
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant='primaryOutline' onClick={toggleDialog}>
              No
            </Button>
            <LinkButton variant='primary' to='/admin/evaluations'>
              Yes
            </LinkButton>
          </Dialog.Actions>
        </Dialog>
      </div>
    </>
  )
}
