import { useEffect, useState, lazy, Suspense } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useMobileView } from "@hooks/use-mobile-view"
import { setSelectedEmployeeIds } from "@redux/slices/skill-map-administration-slice"
import {
  getSkillMapResults,
  sendReminder,
  reopenSkillMapResult,
  deleteSkillMapResult,
} from "@redux/slices/skill-map-results-slice"
import { Button } from "@components/ui/button/button"
import { SkillMapAdminStatus } from "@custom-types/skill-map-admin-type"
import { Icon } from "@components/ui/icon/icon"
import { getSkillMapResultStatusVariant } from "@utils/variant"
import Tooltip from "@components/ui/tooltip/tooltip"
import { setAlert } from "@redux/slices/app-slice"
import { convertToFullDateAndTime } from "@utils/format-date"
import { type User } from "@custom-types/user-type"
import { SkillMapResultStatus } from "@custom-types/skill-map-result-type"
import { Badge } from "@components/ui/badge/badge"
import { Loading } from "@custom-types/loadingType"

export const ViewSkillMapAdminList = () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAppSelector((state) => state.auth)
  const { skill_map_administration } = useAppSelector((state) => state.skillMapAdministration)
  const { loading, skill_map_results } = useAppSelector((state) => state.skillMapResults)
  const [showEmailLogDialog, setShowEmailLogDialog] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteialog] = useState<boolean>(false)
  const [selectedRespondent, setSelectedRespondent] = useState<User | null>(null)
  const [selectedSkillMapResultId, setSelectedSkillMapResultId] = useState<number | null>(null)

  const isMobile = useMobileView(1028)

  const SkillMapAdminDialog = lazy(
    async () =>
      await import("@features/admin/skill-map-administrations/skill-map-administrations-dialog")
  )

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(
        getSkillMapResults({
          skill_map_administration_id: id,
        })
      )
    }
  }, [id])

  const toggleEmailLogDialog = (evaluator_id: number | null) => {
    const respondents = skill_map_results.map((result) => result.users)
    setSelectedRespondent(respondents.find((user) => user?.id === evaluator_id) ?? null)
    setShowEmailLogDialog((prev) => !prev)
  }

  const toggleDeleteDialog = (id: number | null) => {
    if (id !== null) {
      setSelectedSkillMapResultId(id)
    }
    setShowDeleteialog((prev) => !prev)
  }

  const handleAddEmployee = () => {
    appDispatch(setSelectedEmployeeIds([]))
    navigate(`/admin/skill-map-administrations/${id}/select`)
  }

  const handleNudge = async (respondent_name: string, respondent_id: number) => {
    if (id !== undefined) {
      try {
        const result = await appDispatch(
          sendReminder({
            id: parseInt(id),
            user_id: respondent_id,
          })
        )

        if (result.type === "skillMapResults/sendReminder/fulfilled") {
          appDispatch(
            setAlert({
              description: `Reminder successfully sent to ${respondent_name}!`,
              variant: "success",
            })
          )
        } else if (result.type === "skillMapResults/sendReminder/rejected") {
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

  const handleReopenByRespondent = async (respondent_name: string, skill_map_result_id: number) => {
    if (skill_map_result_id !== undefined) {
      try {
        const result = await appDispatch(reopenSkillMapResult(skill_map_result_id))

        if (result.type === "skillMapResults/reopenSkillMapResult/fulfilled") {
          appDispatch(
            setAlert({
              description: `Successfully reopened skill map for ${respondent_name}!`,
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  const handleDelete = async () => {
    if (selectedSkillMapResultId !== null) {
      try {
        const result = await appDispatch(deleteSkillMapResult(selectedSkillMapResultId))
        if (result.type === "skillMapResults/deleteSkillMapResult/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "skillMapResults/deleteSkillMapResult/fulfilled") {
          appDispatch(
            setAlert({
              description: "Skill map result deleted successfully",
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  return (
    <>
      <div className={`flex flex-col gap-8 mb-4`}>
        <div className={`flex flex-col ${isMobile ? "overflow-x-auto" : ""}`}>
          {skill_map_results?.map((skillMapResult, skillMapIndex) => (
            <div key={skillMapIndex} className='mb-2 ml-2'>
              <div className='flex gap-5 mb-2 items-center'>
                <div>
                  <div className='flex items-center'>
                    <div className='flex flex-row items-center gap-5'>
                      <span className='mx-4 w-64 text-start'>
                        - {skillMapResult.users?.last_name}, {skillMapResult.users?.first_name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='w-20'>
                  <Badge
                    size={"small"}
                    variant={getSkillMapResultStatusVariant(skillMapResult.status ?? "")}
                  >
                    <div className='uppercase'>{skillMapResult.status ?? ""}</div>
                  </Badge>
                </div>
                <div className='w-5'>
                  {skill_map_administration?.status === SkillMapAdminStatus.Ongoing &&
                  skillMapResult.status !== SkillMapResultStatus.Submitted ? (
                    <Button
                      variant='unstyled'
                      size='small'
                      onClick={() => toggleDeleteDialog(skillMapResult.id)}
                    >
                      <Icon icon='Trash' size='extraSmall' color='gray' />
                    </Button>
                  ) : null}
                </div>
                {skill_map_administration?.status === SkillMapAdminStatus.Ongoing &&
                  skillMapResult.status === SkillMapResultStatus.Ongoing && (
                    <div className='w-20'>
                      <Tooltip placement='bottomStart'>
                        <Tooltip.Trigger>
                          <Button
                            variant='primaryOutline'
                            size='small'
                            onClick={async () =>
                              await handleNudge(
                                skillMapResult.users?.first_name as string,
                                skillMapResult.users?.id as number
                              )
                            }
                          >
                            Nudge
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {skillMapResult?.email_logs?.length === 0 && <p>No reminders sent.</p>}
                          {skillMapResult.email_logs !== undefined &&
                            skillMapResult?.email_logs.length > 0 &&
                            skillMapResult?.email_logs.length <= 3 && (
                              <p>
                                {skillMapResult?.email_logs.length}{" "}
                                {skillMapResult?.email_logs.length === 1 ? "reminder" : "reminders"}{" "}
                                sent. Reminders sent last:
                              </p>
                            )}
                          {skillMapResult?.email_logs !== undefined &&
                            skillMapResult?.email_logs.length > 3 && (
                              <p>
                                {skillMapResult?.email_logs.length} reminders sent. Latest reminders
                                sent last:
                              </p>
                            )}
                          {skillMapResult?.email_logs
                            ?.slice(0, 3)
                            .map((emailLog) => (
                              <p key={emailLog.id}>
                                - {convertToFullDateAndTime(emailLog.sent_at, user)}
                              </p>
                            ))}
                          {skillMapResult?.email_logs !== undefined &&
                            skillMapResult?.email_logs.length > 3 && (
                              <Button
                                variant='unstyled'
                                size='small'
                                onClick={() => toggleEmailLogDialog(skillMapResult.users?.id ?? 0)}
                              >
                                <span className='text-primary-500 text-xs underline'>
                                  View More
                                </span>
                              </Button>
                            )}
                        </Tooltip.Content>
                      </Tooltip>
                    </div>
                  )}
                {skillMapResult.status === SkillMapResultStatus.Submitted && (
                  <div className='w-20'>
                    <Button
                      variant='primaryOutline'
                      size='small'
                      onClick={async () =>
                        await handleReopenByRespondent(
                          skillMapResult.users?.first_name as string,
                          skillMapResult.id
                        )
                      }
                    >
                      Reopen
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <>
            {loading !== Loading.Pending &&
            (skill_map_administration?.status === SkillMapAdminStatus.Draft ||
              skill_map_administration?.status === SkillMapAdminStatus.Pending ||
              skill_map_administration?.status === SkillMapAdminStatus.Ongoing) ? (
              <>
                {skill_map_results?.length === 0 ? (
                  <div className='pb-4 pl-2'>
                    No employees added yet. Click{" "}
                    <span
                      onClick={handleAddEmployee}
                      className='text-primary-500 cursor-pointer underline'
                    >
                      {" "}
                      here
                    </span>{" "}
                    to add.
                  </div>
                ) : (
                  <div className='flex justify-start py-5'>
                    <Button onClick={handleAddEmployee} variant={"ghost"}>
                      <Icon icon='Plus' size='small' color='primary' />
                      <p className='text-primary-500 uppercase whitespace-nowrap text-sm'>
                        Add Employee
                      </p>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                {loading !== Loading.Pending && skill_map_results?.length === 0 && (
                  <p className='ml-2'>No Employees.</p>
                )}
              </>
            )}
          </>
        </div>
      </div>
      <Suspense>
        <SkillMapAdminDialog
          open={showEmailLogDialog}
          title='Email Logs'
          description={
            <>
              <p>
                {selectedRespondent?.email_logs?.length} reminders sent. Latest reminders sent last:
              </p>
              {selectedRespondent?.email_logs?.map((emailLog) => (
                <p key={emailLog.id}>- {convertToFullDateAndTime(emailLog.sent_at, user)}</p>
              ))}
            </>
          }
          onSubmit={() => toggleEmailLogDialog(null)}
          showCloseButton={false}
          submitButtonLabel='Close'
        />
      </Suspense>
      <Suspense>
        <SkillMapAdminDialog
          open={showDeleteDialog}
          title='Delete Respondent'
          description={
            <>
              Are you sure you want to delete this respondent? <br />
            </>
          }
          onClose={() => toggleDeleteDialog(null)}
          onSubmit={async () => {
            await handleDelete()
            toggleDeleteDialog(null)
          }}
        />
      </Suspense>
    </>
  )
}
