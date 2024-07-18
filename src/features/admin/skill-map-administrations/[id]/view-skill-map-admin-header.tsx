import { useState, useContext } from "react"
import { Button, LinkButton } from "@components/ui/button/button"
import { useAppSelector } from "@hooks/useAppSelector"
import { useNavigate, useParams } from "react-router-dom"
import { SkillMapAdminStatus } from "@custom-types/skill-map-admin-type"
import { Icon } from "@components/ui/icon/icon"
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
import {
  deleteSkillMapAdmin,
  closeSkillMapAdministration,
  cancelSkillMapAdministration,
  reopenSkillMapAdministration,
} from "@redux/slices/skill-map-administration-slice"
import { ReadyState } from "react-use-websocket"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"
import { getSkillMapResultsAll } from "@redux/slices/skill-map-results-slice"

export const ViewSkillMapAdminHeader = () => {
  const navigate = useNavigate()
  const isMobile = useMobileView()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, skill_map_administration } = useAppSelector(
    (state) => state.skillMapAdministration
  )
  const { previousUrl } = useAppSelector((state) => state.app)
  const { sendJsonMessage, readyState } = useContext(WebSocketContext) as WebSocketType

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showCloseDialog, setShowCloseDialog] = useState<boolean>(false)
  const [showReopenDialog, setShowReopenDialog] = useState<boolean>(false)

  const toggleDeleteDialog = () => {
    setShowDeleteDialog((prev) => !prev)
  }

  const toggleCloseDialog = () => {
    setShowCloseDialog((prev) => !prev)
  }

  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const toggleReopenDialog = () => {
    setShowReopenDialog((prev) => !prev)
  }

  const handleDelete = async () => {
    if (id !== undefined) {
      const result = await appDispatch(deleteSkillMapAdmin(parseInt(id)))
      if (result.type === "skillMapAdministration/deleteSkillMapAdmin/fulfilled") {
        appDispatch(
          setAlert({
            description: "Skill Map Administration has been deleted successfully.",
            variant: "success",
          })
        )
        if (previousUrl !== null) {
          navigate(previousUrl)
          return
        }
        navigate("/admin/skill-map-administrations")
      }

      if (result.type === "skillMapAdministration/deleteSkillMapAdmin/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
    }
  }

  const handleClose = async () => {
    if (id !== undefined) {
      const result = await appDispatch(closeSkillMapAdministration(parseInt(id)))
      if (result.type === "skillMapAdministration/close/fulfilled") {
        appDispatch(
          setAlert({
            description: "Skill Map Admin has been closed successfully.",
            variant: "success",
          })
        )

        toggleCloseDialog()
        if (readyState === ReadyState.OPEN) {
          sendJsonMessage({
            event: "closeSkillMapAdministration",
            data: "closeSkillMapAdministration",
          })
        }

        void appDispatch(
          getSkillMapResultsAll({
            skill_map_administration_id: id,
          })
        )
      }
    }
  }

  const handleCancel = async () => {
    if (id !== undefined) {
      const result = await appDispatch(cancelSkillMapAdministration(parseInt(id)))
      if (result.type === "skillMapAdministration/cancel/fulfilled") {
        appDispatch(
          setAlert({
            description: "Skill Map Admin has been cancelled successfully.",
            variant: "success",
          })
        )
        if (readyState === ReadyState.OPEN) {
          sendJsonMessage({
            event: "cancelSkillMapAdministration",
            data: "cancelSkillMapAdministration",
          })
        }
        toggleCancelDialog()
      }
    }
  }

  const handleReopen = async () => {
    if (id !== undefined) {
      try {
        const result = await appDispatch(reopenSkillMapAdministration(parseInt(id)))
        if (result.type === "skillMapAdministration/reopen/fulfilled") {
          appDispatch(
            setAlert({
              description: "Skill Map Admin has been reopened successfully.",
              variant: "success",
            })
          )
          if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              event: "reopenSkillMapAdministration",
              data: "reopenSkillMapAdministration",
            })
          }

          void appDispatch(
            getSkillMapResultsAll({
              skill_map_administration_id: id,
            })
          )

          toggleReopenDialog()
        }
        if (result.type === "skillMapAdministration/reopen/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
      } catch (error) {}
    }
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col items-start justify-between gap-4 mt-2 md:items-end md:flex-row'>
          <div>
            <div className='flex items-end gap-4 mb-4 primary-outline'>
              <PageTitle>{skill_map_administration?.name}</PageTitle>
              <Badge
                size={isMobile ? "small" : "medium"}
                variant={getEvaluationAdministrationStatusVariant(skill_map_administration?.status)}
              >
                <div className='uppercase'>{skill_map_administration?.status}</div>
              </Badge>
            </div>
            <DateRangeDisplay
              label={`${isMobile ? "Map Period" : "Skill Map Period"}`}
              startDate={skill_map_administration?.skill_map_period_start_date}
              endDate={skill_map_administration?.skill_map_period_end_date}
              isMobile={isMobile}
            />
            <DateRangeDisplay
              label={`${isMobile ? "Map Schedule" : "Skill Map Schedule"}`}
              startDate={skill_map_administration?.skill_map_schedule_start_date}
              endDate={skill_map_administration?.skill_map_schedule_end_date}
              isMobile={isMobile}
            />
          </div>
          <div className='flex justify-between gap-4'>
            {(skill_map_administration?.status === SkillMapAdminStatus.Ongoing ||
              skill_map_administration?.status === SkillMapAdminStatus.Closed) && (
              <LinkButton
                variant='primary'
                size={isMobile ? "small" : "medium"}
                to={`/admin/skill-map-administrations/${id}/results`}
              >
                Results
              </LinkButton>
            )}
            {skill_map_administration?.status !== SkillMapAdminStatus.Processing &&
              skill_map_administration?.status !== SkillMapAdminStatus.Cancelled &&
              skill_map_administration?.is_uploaded === null && (
                <Dropdown>
                  <Dropdown.Trigger>
                    <Button size={isMobile ? "small" : "medium"}>
                      <div className='whitespace-nowrap'>More actions</div>
                      <Icon icon='ChevronDown' size={isMobile ? "small" : "medium"} />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Content size={isMobile ? "small" : "medium"}>
                    {(skill_map_administration?.status === SkillMapAdminStatus.Draft ||
                      skill_map_administration?.status === SkillMapAdminStatus.Pending) && (
                      <Dropdown.Item
                        onClick={() => navigate(`/admin/skill-map-administrations/${id}/edit`)}
                      >
                        <Icon icon='PenSquare' size='extraSmall' color='gray' />
                        Edit
                      </Dropdown.Item>
                    )}
                    {skill_map_administration?.status === SkillMapAdminStatus.Draft && (
                      <Dropdown.Item onClick={toggleDeleteDialog}>
                        <Icon icon='Trash' size='extraSmall' color='gray' />
                        Delete
                      </Dropdown.Item>
                    )}
                    {skill_map_administration?.status === SkillMapAdminStatus.Ongoing && (
                      <Dropdown.Item onClick={toggleCloseDialog}>
                        <Icon icon='Lock' size='extraSmall' color='gray' />
                        Close
                      </Dropdown.Item>
                    )}
                    {(skill_map_administration?.status === SkillMapAdminStatus.Pending ||
                      skill_map_administration?.status === SkillMapAdminStatus.Ongoing) && (
                      <Dropdown.Item onClick={toggleCancelDialog}>
                        <Icon icon='Ban' size='extraSmall' color='gray' />
                        Cancel
                      </Dropdown.Item>
                    )}
                    {skill_map_administration?.status === SkillMapAdminStatus.Closed && (
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
          {skill_map_administration?.remarks}
        </pre>
      </div>
      <h2 className='mt-5 mb-5 text-2xl font-bold'>Employees</h2>
      <CustomDialog
        open={showDeleteDialog}
        title='Delete Skill Map'
        description={
          <>
            Are you sure you want to delete this skill map? <br /> This action cannot be reverted.
          </>
        }
        onClose={toggleDeleteDialog}
        onSubmit={handleDelete}
        loading={loading === Loading.Pending}
      />
      <CustomDialog
        open={showCloseDialog}
        title='Close Skill Map'
        description={
          <>
            Are you sure you want to close this skill map? <br /> This action cannot be reverted.
          </>
        }
        onClose={toggleCloseDialog}
        onSubmit={handleClose}
        loading={loading === Loading.Pending}
      />
      <CustomDialog
        open={showCancelDialog}
        title='Cancel Skill Map'
        description={
          <>
            Are you sure you want to cancel this skill map? <br /> This action cannot be reverted.
          </>
        }
        onClose={toggleCancelDialog}
        onSubmit={handleCancel}
        loading={loading === Loading.Pending}
      />
      <CustomDialog
        open={showReopenDialog}
        title='Reopen Skill Map'
        description='Are you sure you want to reopen this skill map?'
        onClose={toggleReopenDialog}
        onSubmit={handleReopen}
        loading={loading === Loading.Pending}
      />
    </>
  )
}
