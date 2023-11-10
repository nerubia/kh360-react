import { useState } from "react"
import { Button, LinkButton } from "../../../../components/button/Button"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useNavigate, useParams } from "react-router-dom"
import { EvaluationAdministrationStatus } from "../../../../types/evaluationAdministrationType"
import { formatDate } from "../../../../utils/formatDate"
import { Icon } from "../../../../components/icon/Icon"
import Dialog from "../../../../components/dialog/Dialog"
import { deleteEvaluationAdminsitration } from "../../../../redux/slices/evaluationAdministrationSlice"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"

export const ViewEvaluationHeader = () => {
  const navigate = useNavigate()
  const { evaluation_administration } = useAppSelector(
    (state) => state.evaluationAdministration
  )
  const { id } = useParams()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const appDispatch = useAppDispatch()

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  const handleDelete = () => {
    navigate("/admin/evaluation-administrations")
    if (id !== undefined) {
      void appDispatch(deleteEvaluationAdminsitration(parseInt(id)))
    }
  }

  return (
    <>
      <div className='text-right'>
        <h1>Evaluation Schedule</h1>(
        {formatDate(evaluation_administration?.eval_schedule_start_date)} to{" "}
        {formatDate(evaluation_administration?.eval_schedule_end_date)})
      </div>
      <div className='flex flex-col'>
        <div className='flex justify-between items-center  mt-2'>
          <div>
            <h1 className='text-2xl font-bold'>
              {evaluation_administration?.name}
            </h1>
            <div>
              Evaluation Period (
              {formatDate(evaluation_administration?.eval_period_start_date)} to{" "}
              {formatDate(evaluation_administration?.eval_period_start_date)})
            </div>
          </div>
          <div className='flex justify-between gap-4'>
            {evaluation_administration?.status ===
              EvaluationAdministrationStatus.Pending ||
            evaluation_administration?.status ===
              EvaluationAdministrationStatus.Ongoing ||
            evaluation_administration?.status ===
              EvaluationAdministrationStatus.Closed ||
            evaluation_administration?.status ===
              EvaluationAdministrationStatus.Cancelled ? (
              <LinkButton variant='primary' size='medium' to={``}>
                Progress
              </LinkButton>
            ) : null}
            <LinkButton
              variant='primary'
              size='medium'
              to={`/admin/evaluation-administrations/${id}/edit`}
            >
              Edit
            </LinkButton>
            {evaluation_administration?.status ===
            EvaluationAdministrationStatus.Draft ? (
              <Button variant='destructive' onClick={toggleDialog}>
                <Icon icon='Trash' />
              </Button>
            ) : null}
            <Dialog open={showDialog}>
              <Dialog.Title>Delete Evaluation</Dialog.Title>
              <Dialog.Description>
                Are you sure you want to delete this record? <br /> This action
                cannot be reverted.
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
        <div className='mt-4'>{evaluation_administration?.remarks}</div>
      </div>
      <h1 className='text-2xl font-bold mt-5 mb-5'>Employees</h1>
    </>
  )
}
