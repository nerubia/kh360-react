import { useEffect, useState, lazy, Suspense } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useMobileView } from "@hooks/use-mobile-view"
import { setSelectedEmployeeIds } from "@redux/slices/survey-administration-slice"
import {
  getSurveyResults,
  sendReminder,
  reopenSurveyResult,
  deleteSurveyResult,
} from "@redux/slices/survey-results-slice"
import { Button } from "@components/ui/button/button"
import { SurveyAdministrationStatus } from "@custom-types/survey-administration-type"
import { Icon } from "@components/ui/icon/icon"
import { Progress } from "@components/ui/progress/progress"
import { getProgressVariant } from "@utils/variant"
import Tooltip from "@components/ui/tooltip/tooltip"
import { setAlert } from "@redux/slices/app-slice"
import { convertToFullDateAndTime } from "@utils/format-date"
import { type User } from "@custom-types/user-type"
import { SurveyResultStatus } from "@custom-types/survey-result-type"

export const ViewSurveyAdminList = () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { survey_administration } = useAppSelector((state) => state.surveyAdministration)
  const { user } = useAppSelector((state) => state.auth)
  const { survey_results } = useAppSelector((state) => state.surveyResults)
  const [showEmailLogDialog, setShowEmailLogDialog] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteialog] = useState<boolean>(false)
  const [selectedRespondent, setSelectedRespondent] = useState<User | null>(null)
  const [selectedSurveyResultId, setSelectedSurveyResultId] = useState<number | null>(null)

  const isMobile = useMobileView(1028)

  const SurveyAdminDialog = lazy(
    async () => await import("@features/admin/survey-administrations/survey-administration-dialog")
  )

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(
        getSurveyResults({
          survey_administration_id: id,
        })
      )
    }
  }, [id])

  const toggleEmailLogDialog = (evaluator_id: number | null) => {
    const respondents = survey_results.map((result) => result.users)
    setSelectedRespondent(respondents.find((user) => user?.id === evaluator_id) ?? null)
    setShowEmailLogDialog((prev) => !prev)
  }

  const toggleDeleteDialog = (id: number | null) => {
    if (id !== null) {
      setSelectedSurveyResultId(id)
    }
    setShowDeleteialog((prev) => !prev)
  }

  const handleAddRespondent = () => {
    appDispatch(setSelectedEmployeeIds([]))
    navigate(`/admin/survey-administrations/${id}/select`)
  }

  const getValue = (totalAnswered: number, totalQuestions: number) => {
    if (totalQuestions !== 0 && totalAnswered !== 0) {
      return (totalAnswered / totalQuestions) * 100
    } else {
      return 0
    }
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

        if (result.type === "surveyResults/sendReminder/fulfilled") {
          appDispatch(
            setAlert({
              description: `Reminder successfully sent to ${respondent_name}!`,
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  const handleReopenByRespondent = async (respondent_name: string, survey_result_id: number) => {
    if (survey_result_id !== undefined) {
      try {
        const result = await appDispatch(reopenSurveyResult(survey_result_id))

        if (result.type === "surveyResults/reopenSurveyResult/fulfilled") {
          appDispatch(
            setAlert({
              description: `Successfully reopened survey for ${respondent_name}!`,
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  const handleDelete = async () => {
    if (selectedSurveyResultId !== null) {
      try {
        const result = await appDispatch(deleteSurveyResult(selectedSurveyResultId))
        if (result.type === "surveyResults/deleteSurveyResult/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "surveyResults/deleteSurveyResult/fulfilled") {
          appDispatch(
            setAlert({
              description: "Survey result deleted successfully",
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
          {survey_results?.map((surveyResult, surveyIndex) => (
            <div key={surveyIndex} className='mb-2 ml-2'>
              <div className='flex gap-8 mb-2 items-center'>
                <div>
                  <div className='flex items-center'>
                    <div className='flex flex-row items-center gap-5'>
                      <span className='mx-4 w-64 text-start'>
                        - {surveyResult.users?.last_name}, {surveyResult.users?.first_name}
                      </span>
                      <Progress
                        variant={getProgressVariant(
                          getValue(
                            surveyResult.total_answered ?? 0,
                            surveyResult.total_questions ?? 0
                          )
                        )}
                        value={getValue(
                          surveyResult.total_answered ?? 0,
                          surveyResult.total_questions ?? 0
                        )}
                        width='w-96 w-56'
                      />
                    </div>
                  </div>
                </div>
                <div className='w-8 text-right'>
                  {Math.round(
                    getValue(surveyResult.total_answered ?? 0, surveyResult.total_questions ?? 0)
                  )}
                  %
                </div>
                <div className='flex gap-4 justify-start'>
                  {surveyResult.total_questions !== surveyResult.total_answered &&
                    survey_administration?.status === SurveyAdministrationStatus.Ongoing && (
                      <Tooltip placement='bottomStart'>
                        <Tooltip.Trigger>
                          <Button
                            variant='primaryOutline'
                            size='small'
                            onClick={async () =>
                              await handleNudge(
                                surveyResult.users?.first_name as string,
                                surveyResult.users?.id as number
                              )
                            }
                          >
                            Nudge
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {surveyResult?.email_logs?.length === 0 && <p>No reminders sent.</p>}
                          {surveyResult.email_logs !== undefined &&
                            surveyResult?.email_logs.length > 0 &&
                            surveyResult?.email_logs.length <= 3 && (
                              <p>
                                {surveyResult?.email_logs.length}{" "}
                                {surveyResult?.email_logs.length === 1 ? "reminder" : "reminders"}{" "}
                                sent. Reminders sent last:
                              </p>
                            )}
                          {surveyResult?.email_logs !== undefined &&
                            surveyResult?.email_logs.length > 3 && (
                              <p>
                                {surveyResult?.email_logs.length} reminders sent. Latest reminders
                                sent last:
                              </p>
                            )}
                          {surveyResult?.email_logs
                            ?.slice(0, 3)
                            .map((emailLog) => (
                              <p key={emailLog.id}>
                                - {convertToFullDateAndTime(emailLog.sent_at, surveyResult.users)}
                              </p>
                            ))}
                          {surveyResult?.email_logs !== undefined &&
                            surveyResult?.email_logs.length > 3 && (
                              <Button
                                variant='unstyled'
                                size='small'
                                onClick={() => toggleEmailLogDialog(surveyResult.users?.id ?? 0)}
                              >
                                <span className='text-primary-500 text-xs underline'>
                                  View More
                                </span>
                              </Button>
                            )}
                        </Tooltip.Content>
                      </Tooltip>
                    )}
                  {surveyResult.status === SurveyResultStatus.Submitted && (
                    <Button
                      variant='primaryOutline'
                      size='small'
                      onClick={async () =>
                        await handleReopenByRespondent(
                          surveyResult.users?.first_name as string,
                          parseInt(surveyResult.id as string)
                        )
                      }
                    >
                      Reopen
                    </Button>
                  )}
                  <Button
                    variant='unstyled'
                    size='small'
                    onClick={() => toggleDeleteDialog(parseInt(surveyResult.id as string))}
                  >
                    <Icon icon='Trash' size='extraSmall' color='gray' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <>
            {(survey_administration?.status === SurveyAdministrationStatus.Draft ||
              survey_administration?.status === SurveyAdministrationStatus.Pending ||
              survey_administration?.status === SurveyAdministrationStatus.Ongoing) && (
              <>
                {survey_results.length === 0 ? (
                  <div className='pb-4 pl-2'>
                    No respondents added yet. Click{" "}
                    <span
                      onClick={handleAddRespondent}
                      className='text-primary-500 cursor-pointer underline'
                    >
                      {" "}
                      here
                    </span>{" "}
                    to add.
                  </div>
                ) : (
                  <div className='flex justify-start py-5'>
                    <Button onClick={handleAddRespondent} variant={"ghost"}>
                      <Icon icon='Plus' size='small' color='primary' />
                      <p className='text-primary-500 uppercase whitespace-nowrap text-sm'>
                        Add Respondent
                      </p>
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        </div>
      </div>
      <Suspense>
        <SurveyAdminDialog
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
        <SurveyAdminDialog
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
