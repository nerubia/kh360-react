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
  publishEvaluationAdministration,
} from "../../../../redux/slices/evaluation-administration-slice"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { PageTitle } from "../../../../components/shared/page-title"
import { Badge } from "../../../../components/ui/badge/badge"
import { getEvaluationAdministrationStatusVariant } from "../../../../utils/variant"
import Dropdown from "../../../../components/ui/dropdown/dropdown"
import { setAlert } from "../../../../redux/slices/app-slice"
import { Loading } from "../../../../types/loadingType"

export const ViewEvaluationHeader = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, evaluation_administration } = useAppSelector(
    (state) => state.evaluationAdministration
  )
  const { previousUrl } = useAppSelector((state) => state.app)

  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showCloseDialog, setShowCloseDialog] = useState<boolean>(false)
  const [showPublishDialog, setShowPublishDialog] = useState<boolean>(false)

  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const toggleDeleteDialog = () => {
    setShowDeleteDialog((prev) => !prev)
  }

  const toggleCloseDialog = () => {
    setShowCloseDialog((prev) => !prev)
  }

  const togglePublishDialog = () => {
    setShowPublishDialog((prev) => !prev)
  }

  const handleCancel = async () => {
    if (id !== undefined) {
      await appDispatch(cancelEvaluationAdministration(parseInt(id)))
      appDispatch(
        setAlert({
          description: "Evaluation has been canceled successfully.",
          variant: "success",
        })
      )
      if (previousUrl !== null) {
        navigate(previousUrl)
        return
      }
      navigate("/admin/evaluation-administrations")
    }
  }

  const handleDelete = async () => {
    if (id !== undefined) {
      await appDispatch(deleteEvaluationAdministration(parseInt(id)))
      appDispatch(
        setAlert({
          description: "Evaluation has been deleted successfully.",
          variant: "success",
        })
      )
      if (previousUrl !== null) {
        navigate(previousUrl)
        return
      }
      navigate("/admin/evaluation-administrations")
    }
  }

  const handleClose = async () => {
    if (id !== undefined) {
      await appDispatch(closeEvaluationAdministration(parseInt(id)))
      appDispatch(
        setAlert({
          description: "Evaluation has been closed successfully.",
          variant: "success",
        })
      )
      if (previousUrl !== null) {
        navigate(previousUrl)
        return
      }
      navigate("/admin/evaluation-administrations")
    }
  }

  const handlePublish = async () => {
    if (id !== undefined) {
      await appDispatch(publishEvaluationAdministration(parseInt(id)))
      appDispatch(
        setAlert({
          description: "Evaluation has been published successfully.",
          variant: "success",
        })
      )
      if (previousUrl !== null) {
        navigate(previousUrl)
        return
      }
      navigate("/admin/evaluation-administrations")
    }
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col items-start justify-between gap-4 mt-2 md:items-end md:flex-row'>
          <div>
            <div className='flex items-end gap-4 mb-4 primary-outline'>
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
            evaluation_administration?.status === EvaluationAdministrationStatus.Cancelled ||
            evaluation_administration?.status === EvaluationAdministrationStatus.Processing ||
            evaluation_administration?.status === EvaluationAdministrationStatus.Published ? (
              <LinkButton
                variant='primary'
                size='medium'
                to={`/admin/evaluation-administrations/${id}/progress`}
              >
                Progress
              </LinkButton>
            ) : null}
            {evaluation_administration?.status !== EvaluationAdministrationStatus.Published && (
              <Dropdown>
                <Dropdown.Trigger>
                  <Button>
                    More actions
                    <Icon icon='ChevronDown' />
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  {(evaluation_administration?.status === EvaluationAdministrationStatus.Draft ||
                    evaluation_administration?.status ===
                      EvaluationAdministrationStatus.Pending) && (
                    <Dropdown.Item
                      onClick={() => navigate(`/admin/evaluation-administrations/${id}/edit`)}
                    >
                      <Icon icon='PenSquare' />
                      Edit
                    </Dropdown.Item>
                  )}
                  {(evaluation_administration?.status === EvaluationAdministrationStatus.Pending ||
                    evaluation_administration?.status ===
                      EvaluationAdministrationStatus.Ongoing) && (
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
                  {evaluation_administration?.status === EvaluationAdministrationStatus.Closed && (
                    <Dropdown.Item onClick={togglePublishDialog}>
                      <Icon icon='UploadCloud' />
                      Publish
                    </Dropdown.Item>
                  )}
                </Dropdown.Content>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <pre className='font-sans break-words whitespace-pre-wrap'>
          {evaluation_administration?.remarks}
        </pre>
      </div>
      <h2 className='mt-5 mb-5 text-2xl font-bold'>Employees</h2>
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
      <Dialog open={showPublishDialog}>
        <Dialog.Title>Publish Evaluation</Dialog.Title>
        <Dialog.Description>Are you sure you want to publish this record?</Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={togglePublishDialog}>
            No
          </Button>
          <Button variant='primary' onClick={handlePublish} loading={loading === Loading.Pending}>
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
