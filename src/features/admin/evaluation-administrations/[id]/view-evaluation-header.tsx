import { useState } from "react"
import { Button, LinkButton } from "../../../../components/ui/button/button"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useNavigate, useParams } from "react-router-dom"
import { EvaluationAdministrationStatus } from "../../../../types/evaluation-administration-type"
import { formatDate } from "../../../../utils/format-date"
import { Icon } from "../../../../components/ui/icon/icon"
import Dialog from "../../../../components/ui/dialog/dialog"
import {
  cancelEvaluationAdministration,
  closeEvaluationAdministration,
  deleteEvaluationAdministration,
} from "../../../../redux/slices/evaluation-administration-slice"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { PageTitle } from "../../../../components/shared/PageTitle"
import { Badge } from "../../../../components/ui/badge/Badge"
import { getEvaluationAdministrationStatusVariant } from "../../../../utils/variant"
import Dropdown from "../../../../components/ui/dropdown/dropdown"
import { setAlert } from "../../../../redux/slices/appSlice"

export const ViewEvaluationHeader = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { evaluation_administration } = useAppSelector((state) => state.evaluationAdministration)

  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showCloseDialog, setShowCloseDialog] = useState<boolean>(false)

  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const toggleDeleteDialog = () => {
    setShowDeleteDialog((prev) => !prev)
  }

  const toggleCloseDialog = () => {
    setShowCloseDialog((prev) => !prev)
  }

  const handleCancel = async () => {
    if (id !== undefined) {
      await appDispatch(cancelEvaluationAdministration(parseInt(id)))
      navigate("/admin/evaluation-administrations")
      appDispatch(
        setAlert({
          description: "Evaluation has been canceled successfully.",
          variant: "success",
        })
      )
    }
  }

  const handleDelete = async () => {
    if (id !== undefined) {
      await appDispatch(deleteEvaluationAdministration(parseInt(id)))
      navigate("/admin/evaluation-administrations")
      appDispatch(
        setAlert({
          description: "Evaluation has been deleted successfully.",
          variant: "success",
        })
      )
    }
  }

  const handleClose = async () => {
    if (id !== undefined) {
      await appDispatch(closeEvaluationAdministration(parseInt(id)))
      navigate("/admin/evaluation-administrations")
      appDispatch(
        setAlert({
          description: "Evaluation has been closed successfully.",
          variant: "success",
        })
      )
    }
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col justify-between items-start md:items-end mt-2 md:flex-row gap-4'>
          <div>
            <div className='flex gap-4 primary-outline items-end mb-4'>
              <PageTitle>{evaluation_administration?.name}</PageTitle>
              <Badge
                variant={getEvaluationAdministrationStatusVariant(
                  evaluation_administration?.status
                )}
              >
                <div className='uppercase'>{evaluation_administration?.status}</div>
              </Badge>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Evaluation Period: </div>
              {formatDate(evaluation_administration?.eval_period_start_date)} to{" "}
              {formatDate(evaluation_administration?.eval_period_end_date)}
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Evaluation Schedule: </div>
              {formatDate(evaluation_administration?.eval_schedule_start_date)} to{" "}
              {formatDate(evaluation_administration?.eval_schedule_end_date)}
            </div>
          </div>
          <div className='flex justify-between gap-4'>
            {evaluation_administration?.status === EvaluationAdministrationStatus.Pending ||
            evaluation_administration?.status === EvaluationAdministrationStatus.Ongoing ||
            evaluation_administration?.status === EvaluationAdministrationStatus.Closed ||
            evaluation_administration?.status === EvaluationAdministrationStatus.Cancelled ? (
              <LinkButton
                variant='primary'
                size='medium'
                to={`/admin/evaluation-administrations/${id}/progress`}
              >
                Progress
              </LinkButton>
            ) : null}
            <Dropdown>
              <Dropdown.Trigger>
                <Button>
                  More actions
                  <Icon icon='ChevronDown' />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Content>
                {(evaluation_administration?.status === EvaluationAdministrationStatus.Draft ||
                  evaluation_administration?.status === EvaluationAdministrationStatus.Pending) && (
                  <Dropdown.Item
                    onClick={() => navigate(`/admin/evaluation-administrations/${id}/edit`)}
                  >
                    <Icon icon='PenSquare' />
                    Edit
                  </Dropdown.Item>
                )}
                {(evaluation_administration?.status === EvaluationAdministrationStatus.Pending ||
                  evaluation_administration?.status === EvaluationAdministrationStatus.Ongoing) && (
                  <Dropdown.Item onClick={toggleCancelDialog}>
                    <Icon icon='Ban' />
                    Cancel
                  </Dropdown.Item>
                )}
                {evaluation_administration?.status === EvaluationAdministrationStatus.Draft && (
                  <Dropdown.Item onClick={toggleDeleteDialog}>
                    <Icon icon='Trash' />
                    Delete
                  </Dropdown.Item>
                )}
                {evaluation_administration?.status === EvaluationAdministrationStatus.Ongoing && (
                  <Dropdown.Item onClick={toggleCloseDialog}>
                    <Icon icon='Close' />
                    Close
                  </Dropdown.Item>
                )}
              </Dropdown.Content>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className='mt-4'>{evaluation_administration?.remarks}</div>
      <h2 className='text-2xl font-bold mt-5 mb-5'>Employees</h2>
      <Dialog open={showCancelDialog}>
        <Dialog.Title>Cancel Evaluation</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to cancel this record? <br /> This action cannot be reverted.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleCancelDialog}>
            No
          </Button>
          <Button variant='primary' onClick={handleCancel}>
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog open={showDeleteDialog}>
        <Dialog.Title>Delete Evaluation</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this record? <br /> This action cannot be reverted.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleDeleteDialog}>
            No
          </Button>
          <Button variant='primary' onClick={handleDelete}>
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog open={showCloseDialog}>
        <Dialog.Title>Close Evaluation</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to close this record? <br /> This action cannot be reverted.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleCloseDialog}>
            No
          </Button>
          <Button variant='primary' onClick={handleClose}>
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
