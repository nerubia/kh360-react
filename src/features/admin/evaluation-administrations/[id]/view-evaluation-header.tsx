import { useState, useContext } from "react"
import { Button, LinkButton } from "@components/ui/button/button"
import { useAppSelector } from "@hooks/useAppSelector"
import { useNavigate, useParams } from "react-router-dom"
import { EvaluationAdministrationStatus } from "@custom-types/evaluation-administration-type"
import { Icon } from "@components/ui/icon/icon"
import {
  cancelEvaluationAdministration,
  closeEvaluationAdministration,
  deleteEvaluationAdministration,
  getEvaluationAdministration,
  publishEvaluationAdministration,
  reopenEvaluationAdministration,
} from "@redux/slices/evaluation-administration-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { PageTitle } from "@components/shared/page-title"
import { Badge } from "@components/ui/badge/badge"
import { getEvaluationAdministrationStatusVariant } from "@utils/variant"
import Dropdown from "@components/ui/dropdown/dropdown"
import { setAlert } from "@redux/slices/app-slice"
import { Loading } from "@custom-types/loadingType"
import { DateRangeDisplay } from "@components/shared/display-range-date"
import { useMobileView } from "@hooks/use-mobile-view"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { ReadyState } from "react-use-websocket"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"
import { type DateValueType } from "react-tailwindcss-datepicker"
import Dialog from "@components/ui/dialog/dialog"
import { DateRangePicker } from "@components/ui/date-range-picker/date-range-picker"

export const ViewEvaluationHeader = () => {
  const { sendJsonMessage, readyState } = useContext(WebSocketContext) as WebSocketType
  const navigate = useNavigate()
  const isMobile = useMobileView()
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
  const [showReopenDialog, setShowReopenDialog] = useState<boolean>(false)
  const [isDateSelected, setIsDateSelected] = useState(false)

  const [formData, setFormData] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  })
  const [validationErrors, setValidationErrors] = useState(false)
  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const toggleDeleteDialog = () => {
    setShowDeleteDialog((prev) => !prev)
  }

  const toggleCloseDialog = () => {
    setFormData({
      startDate: null,
      endDate: null,
    })
    setShowCloseDialog((prev) => !prev)
  }

  const togglePublishDialog = () => {
    setShowPublishDialog((prev) => !prev)
  }

  const toggleReopenDialog = () => {
    setValidationErrors(false)
    setFormData({
      startDate: null,
      endDate: evaluation_administration?.eval_schedule_end_date ?? null,
    })
    setShowReopenDialog((prev) => !prev)
  }

  const handleCancel = async () => {
    if (id !== undefined) {
      const result = await appDispatch(cancelEvaluationAdministration(parseInt(id)))
      if (result.type === "evaluationAdministration/cancel/fulfilled") {
        appDispatch(
          setAlert({
            description: "Evaluation has been canceled successfully.",
            variant: "success",
          })
        )
        if (readyState === ReadyState.OPEN) {
          sendJsonMessage({
            event: "cancelEvaluationAdministration",
            data: "cancelEvaluationAdministration",
          })
        }
        if (previousUrl !== null) {
          navigate(previousUrl)
          return
        }
        navigate("/admin/evaluation-administrations")
      }
      if (result.type === "evaluationAdministration/cancel/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
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
      const result = await appDispatch(closeEvaluationAdministration(parseInt(id)))
      if (result.type === "evaluationAdministration/close/fulfilled") {
        appDispatch(
          setAlert({
            description: "Evaluation has been closed successfully.",
            variant: "success",
          })
        )
        if (readyState === ReadyState.OPEN) {
          sendJsonMessage({
            event: "closeEvaluationAdministration",
            data: "closeEvaluationAdministration",
          })
        }
        if (previousUrl !== null) {
          navigate(previousUrl)
          return
        }
        navigate("/admin/evaluation-administrations")
      }
    }
  }

  const handlePublish = async () => {
    if (id !== undefined) {
      const result = await appDispatch(publishEvaluationAdministration(parseInt(id)))
      if (result.type === "evaluationAdministration/publish/fulfilled") {
        appDispatch(
          setAlert({
            description: "Evaluation has been published successfully.",
            variant: "success",
          })
        )
        if (readyState === ReadyState.OPEN) {
          sendJsonMessage({
            event: "publishEvaluationAdministration",
            data: "publishEvaluationAdministration",
          })
        }
        if (previousUrl !== null) {
          navigate(previousUrl)
          return
        }
        navigate("/admin/evaluation-administrations")
      }
      if (result.type === "evaluationAdministration/publish/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
    }
  }
  const handleReopen = async () => {
    if (id !== undefined) {
      try {
        if (formData?.endDate === undefined || formData.endDate === null) {
          setValidationErrors(true)
          return
        }
        if (
          !isDateSelected &&
          evaluation_administration?.eval_schedule_end_date != null &&
          new Date() > new Date(evaluation_administration.eval_schedule_end_date)
        ) {
          setValidationErrors(true)
          return
        }

        const endDate = new Date(formData.endDate)
        const result = await appDispatch(reopenEvaluationAdministration({ id, endDate }))

        if (result.type === "evaluationAdministration/reopen/fulfilled") {
          appDispatch(
            setAlert({
              description: "Evaluation has been reopened successfully.",
              variant: "success",
            })
          )
          await appDispatch(getEvaluationAdministration(result.payload.id))
          if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              event: "reopenEvaluationAdministration",
              data: "reopenEvaluationAdministration",
            })
          }
        } else if (result.type === "evaluationAdministration/reopen/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        setShowReopenDialog(false)
      } catch (error) {}
    }
  }

  const handleChangeDateRange = (newValue: DateValueType) => {
    setFormData(newValue)
    setIsDateSelected(true)
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col items-start justify-between gap-4 mt-2 md:items-end md:flex-row'>
          <div>
            <div className='flex items-end gap-4 mb-4 primary-outline'>
              <PageTitle>{evaluation_administration?.name}</PageTitle>
              <Badge
                size={isMobile ? "small" : "medium"}
                variant={getEvaluationAdministrationStatusVariant(
                  evaluation_administration?.status
                )}
              >
                <div className='uppercase'>{evaluation_administration?.status}</div>
              </Badge>
            </div>
            <DateRangeDisplay
              label='Evaluation Period'
              startDate={evaluation_administration?.eval_period_start_date}
              endDate={evaluation_administration?.eval_period_end_date}
              isMobile={isMobile}
            />
            <DateRangeDisplay
              label='Evaluation Schedule'
              startDate={evaluation_administration?.eval_schedule_start_date}
              endDate={evaluation_administration?.eval_schedule_end_date}
              isMobile={isMobile}
            />
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
                size={isMobile ? "small" : "medium"}
                to={`/admin/evaluation-administrations/${id}/progress`}
              >
                Progress
              </LinkButton>
            ) : null}
            {evaluation_administration?.status !== EvaluationAdministrationStatus.Published &&
              evaluation_administration?.status !== EvaluationAdministrationStatus.Processing &&
              evaluation_administration?.status !== EvaluationAdministrationStatus.Cancelled && (
                <Dropdown>
                  <Dropdown.Trigger>
                    <Button size={isMobile ? "small" : "medium"}>
                      <div className='whitespace-nowrap'>More actions</div>
                      <Icon icon='ChevronDown' size={isMobile ? "small" : "medium"} />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Content size={isMobile ? "small" : "medium"}>
                    {(evaluation_administration?.status === EvaluationAdministrationStatus.Draft ||
                      evaluation_administration?.status ===
                        EvaluationAdministrationStatus.Pending) && (
                      <Dropdown.Item
                        onClick={() => navigate(`/admin/evaluation-administrations/${id}/edit`)}
                      >
                        <Icon icon='PenSquare' size='extraSmall' color='gray' />
                        Edit
                      </Dropdown.Item>
                    )}
                    {(evaluation_administration?.status ===
                      EvaluationAdministrationStatus.Pending ||
                      evaluation_administration?.status ===
                        EvaluationAdministrationStatus.Ongoing) && (
                      <Dropdown.Item onClick={toggleCancelDialog}>
                        <Icon icon='Ban' size='extraSmall' color='gray' />
                        Cancel
                      </Dropdown.Item>
                    )}
                    {evaluation_administration?.status === EvaluationAdministrationStatus.Draft && (
                      <Dropdown.Item onClick={toggleDeleteDialog}>
                        <Icon icon='Trash' size='extraSmall' color='gray' />
                        Delete
                      </Dropdown.Item>
                    )}
                    {evaluation_administration?.status ===
                      EvaluationAdministrationStatus.Ongoing && (
                      <Dropdown.Item onClick={toggleCloseDialog}>
                        <Icon icon='Lock' size='extraSmall' color='gray' />
                        Close
                      </Dropdown.Item>
                    )}
                    {evaluation_administration?.status ===
                      EvaluationAdministrationStatus.Closed && (
                      <Dropdown.Item onClick={togglePublishDialog}>
                        <Icon icon='UploadCloud' size='extraSmall' color='gray' />
                        Publish
                      </Dropdown.Item>
                    )}
                    {evaluation_administration?.status ===
                      EvaluationAdministrationStatus.Closed && (
                      <Dropdown.Item onClick={toggleReopenDialog}>
                        <Icon icon='RefreshCw' size='extraSmall' color='gray' />
                        Reopen
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
      <h2 className='mt-5 mb-5 text-2xl font-bold'>Evaluees</h2>
      <CustomDialog
        open={showCancelDialog}
        title='Cancel Evaluation'
        description={
          <>
            Are you sure you want to cancel this record? <br /> This action cannot be reverted.
          </>
        }
        onClose={toggleCancelDialog}
        onSubmit={handleCancel}
        loading={loading === Loading.Pending}
      />
      <CustomDialog
        open={showDeleteDialog}
        title='Delete Evaluation'
        description={
          <>
            Are you sure you want to delete this record? <br /> This action cannot be reverted.
          </>
        }
        onClose={toggleDeleteDialog}
        onSubmit={handleDelete}
        loading={loading === Loading.Pending}
      />
      <CustomDialog
        open={showCloseDialog}
        title='Close Evaluation'
        description={
          <>
            Are you sure you want to close this record? <br /> This action cannot be reverted.
          </>
        }
        onClose={toggleCloseDialog}
        onSubmit={handleClose}
        loading={loading === Loading.Pending}
      />
      <CustomDialog
        open={showPublishDialog}
        title='Publish Evaluation'
        description='Are you sure you want to publish this record?'
        onClose={togglePublishDialog}
        onSubmit={handlePublish}
        loading={loading === Loading.Pending}
      />
      {evaluation_administration?.eval_schedule_end_date != null &&
      new Date() > new Date(evaluation_administration.eval_schedule_end_date) ? (
        <Dialog open={showReopenDialog} size='extraSmall'>
          {
            <div className='mr-1 '>
              <div className='flex flex-row justify-start items-center font-bold mt-1'>
                Evaluation Schedule
                <div className='font-light text-sm'>
                  <DateRangeDisplay
                    label=''
                    startDate={evaluation_administration?.eval_schedule_start_date}
                    endDate={evaluation_administration?.eval_schedule_end_date}
                    isMobile={isMobile}
                  />
                </div>
              </div>
              <div className='flex whitespace-nowrap justify-start align-center gap-20'>
                <h6 className={`flex items-center font-bold ${validationErrors ? "mb-5" : ""}`}>
                  Reschedule End Date:
                </h6>
                <DateRangePicker
                  useRange={false}
                  asSingle={true}
                  value={formData}
                  reopenMinDate={new Date()}
                  onChange={handleChangeDateRange}
                  reopenError={validationErrors}
                  readOnly={true}
                />
              </div>

              <div className='flex gap-2 justify-between mt-10 text-normal'>
                <Button
                  variant='primaryOutline'
                  onClick={toggleReopenDialog}
                  testId='DialogNoButton'
                >
                  Cancel
                </Button>
                <Button variant='primary' onClick={handleReopen} testId='DialogYesButton'>
                  Reopen
                </Button>
              </div>
            </div>
          }
        </Dialog>
      ) : (
        <Dialog open={showReopenDialog} size='small'>
          <Dialog.Title>{<div>Reopen Evaluation</div>}</Dialog.Title>
          <Dialog.Description>Are you sure you want to reopen?</Dialog.Description>
          <Dialog.Actions>
            <Button variant='primaryOutline' onClick={toggleReopenDialog} testId='DialogNoButton'>
              Cancel
            </Button>
            <Button variant='primary' onClick={handleReopen} testId='DialogYesButton'>
              Reopen
            </Button>
          </Dialog.Actions>
        </Dialog>
      )}
    </>
  )
}
