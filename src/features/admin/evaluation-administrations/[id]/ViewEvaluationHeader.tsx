import { useState } from "react"
import { Button, LinkButton } from "../../../../components/button/Button"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useNavigate, useParams } from "react-router-dom"
import { EvaluationAdministrationStatus } from "../../../../types/evaluation-administration-type"
import { formatDate } from "../../../../utils/format-date"
import { Icon } from "../../../../components/icon/Icon"
import Dialog from "../../../../components/dialog/Dialog"
import {
  cancelEvaluationAdministration,
  closeEvaluationAdministration,
  deleteEvaluationAdministration,
} from "../../../../redux/slices/evaluation-administration-slice"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { PageTitle } from "../../../../components/shared/PageTitle"
import { Badge } from "../../../../components/badge/Badge"
import { getEvaluationAdministrationStatusVariant } from "../../../../utils/variant"
import Dropdown from "../../../../components/ui/dropdown/dropdown"

export const ViewEvaluationHeader = () => {
  const navigate = useNavigate()
  const { evaluation_administration } = useAppSelector((state) => state.evaluationAdministration)
  const { id } = useParams()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const appDispatch = useAppDispatch()

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  const handleDelete = async () => {
    if (id !== undefined) {
      await appDispatch(deleteEvaluationAdministration(parseInt(id)))
      navigate("/admin/evaluation-administrations")
    }
  }

  const handleCancel = async () => {
    if (id !== undefined) {
      await appDispatch(cancelEvaluationAdministration(parseInt(id)))
      navigate("/admin/evaluation-administrations")
    }
  }

  const handleClose = async () => {
    if (id !== undefined) {
      await appDispatch(closeEvaluationAdministration(parseInt(id)))
      navigate("/admin/evaluation-administrations")
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
              <LinkButton variant='primary' size='medium' to={``}>
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
                  <Dropdown.Item onClick={handleCancel}>
                    <Icon icon='Ban' />
                    Cancel
                  </Dropdown.Item>
                )}
                {evaluation_administration?.status === EvaluationAdministrationStatus.Draft && (
                  <Dropdown.Item onClick={toggleDialog}>
                    <Icon icon='Trash' />
                    Delete
                  </Dropdown.Item>
                )}
                {evaluation_administration?.status === EvaluationAdministrationStatus.Ongoing && (
                  <Dropdown.Item onClick={handleClose}>
                    <Icon icon='Close' />
                    Close
                  </Dropdown.Item>
                )}
              </Dropdown.Content>
            </Dropdown>
            <Dialog open={showDialog}>
              <Dialog.Title>Delete Evaluation</Dialog.Title>
              <Dialog.Description>
                Are you sure you want to delete this record? <br /> This action cannot be reverted.
              </Dialog.Description>
              <Dialog.Actions>
                <Button variant='primaryOutline' onClick={toggleDialog}>
                  No
                </Button>
                <Button variant='primary' onClick={handleDelete}>
                  Yes
                </Button>
              </Dialog.Actions>
            </Dialog>
          </div>
        </div>
      </div>
      <div className='mt-4'>{evaluation_administration?.remarks}</div>
      <h1 className='text-2xl font-bold mt-5 mb-5'>Employees</h1>
    </>
  )
}
