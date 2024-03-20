import { useState } from "react"
import { Button } from "@components/ui/button/button"
import { useAppSelector } from "@hooks/useAppSelector"
import { useNavigate, useParams } from "react-router-dom"
import { EvaluationAdministrationStatus } from "@custom-types/evaluation-administration-type"
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
import { deleteSurveyAdministration } from "@redux/slices/survey-administration-slice"

export const ViewSurveyAdminHeader = () => {
  const navigate = useNavigate()
  const isMobile = useMobileView()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, survey_administration } = useAppSelector((state) => state.surveyAdministration)
  const { previousUrl } = useAppSelector((state) => state.app)

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const toggleDeleteDialog = () => {
    setShowDeleteDialog((prev) => !prev)
  }

  const handleDelete = async () => {
    if (id !== undefined) {
      const result = await appDispatch(deleteSurveyAdministration(parseInt(id)))
      if (result.type === "surveyAdministration/deleteSurveyAdministration/fulfilled") {
        appDispatch(
          setAlert({
            description: "Survey Administration has been deleted successfully.",
            variant: "success",
          })
        )
        if (previousUrl !== null) {
          navigate(previousUrl)
          return
        }
        navigate("/admin/survey-administrations")
      }

      if (result.type === "surveyAdministration/deleteSurveyAdministration/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
    }
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col items-start justify-between gap-4 mt-2 md:items-end md:flex-row'>
          <div>
            <div className='flex items-end gap-4 mb-4 primary-outline'>
              <PageTitle>{survey_administration?.name}</PageTitle>
              <Badge
                size={isMobile ? "small" : "medium"}
                variant={getEvaluationAdministrationStatusVariant(survey_administration?.status)}
              >
                <div className='uppercase'>{survey_administration?.status}</div>
              </Badge>
            </div>
            <DateRangeDisplay
              label='Survey Schedule'
              startDate={survey_administration?.survey_start_date}
              endDate={survey_administration?.survey_end_date}
              isMobile={isMobile}
            />
          </div>
          <div className='flex justify-between gap-4'>
            {survey_administration?.status !== EvaluationAdministrationStatus.Published &&
              survey_administration?.status !== EvaluationAdministrationStatus.Processing &&
              survey_administration?.status !== EvaluationAdministrationStatus.Cancelled && (
                <Dropdown>
                  <Dropdown.Trigger>
                    <Button size={isMobile ? "small" : "medium"}>
                      <div className='whitespace-nowrap'>More actions</div>
                      <Icon icon='ChevronDown' size={isMobile ? "small" : "medium"} />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Content size={isMobile ? "small" : "medium"}>
                    {(survey_administration?.status === EvaluationAdministrationStatus.Draft ||
                      survey_administration?.status === EvaluationAdministrationStatus.Pending) && (
                      <Dropdown.Item
                        onClick={() => navigate(`/admin/survey-administrations/${id}/edit`)}
                      >
                        <Icon icon='PenSquare' size='extraSmall' color='gray' />
                        Edit
                      </Dropdown.Item>
                    )}
                    {survey_administration?.status === EvaluationAdministrationStatus.Draft && (
                      <Dropdown.Item onClick={toggleDeleteDialog}>
                        <Icon icon='Trash' size='extraSmall' color='gray' />
                        Delete
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
          {survey_administration?.remarks}
        </pre>
      </div>
      <h2 className='mt-5 mb-5 text-2xl font-bold'>Respondents</h2>
      <CustomDialog
        open={showDeleteDialog}
        title='Delete Survey'
        description={
          <>
            Are you sure you want to delete this survey? <br /> This action cannot be reverted.
          </>
        }
        onClose={toggleDeleteDialog}
        onSubmit={handleDelete}
        loading={loading === Loading.Pending}
      />
    </>
  )
}
