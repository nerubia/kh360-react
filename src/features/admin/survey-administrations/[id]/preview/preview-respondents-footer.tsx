import { Suspense, lazy, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { setAlert } from "@redux/slices/app-slice"
import { createSurveyResults } from "@redux/slices/survey-results-slice"
import { Loading } from "@custom-types/loadingType"

const SurveyAdminDialog = lazy(
  async () => await import("@features/admin/survey-administrations/survey-administration-dialog")
)

export const PreviewRespondentsFooter = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showDialog, setShowDialog] = useState<boolean>(false)

  const { selectedEmployeeIds } = useAppSelector((state) => state.surveyAdministration)
  const { loading } = useAppSelector((state) => state.surveyResults)

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  const handleSubmit = async () => {
    try {
      const result = await appDispatch(
        createSurveyResults({
          survey_administration_id: id,
          employee_ids: selectedEmployeeIds,
        })
      )
      if (result.type === "surveyResults/createSurveyResults/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      } else if (result.type === "surveyResults/createSurveyResults/fulfilled") {
        navigate(`/admin/survey-administrations/${id}`)
      }
    } catch (error) {}
  }

  const handleRedirect = () => {
    navigate(`/admin/survey-administrations/${id}`)
  }
  return (
    <>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleDialog}>
          Cancel & Exit
        </Button>
        <div className='flex items-center gap-2'>
          <LinkButton
            testId='BackButton'
            variant='primaryOutline'
            size='medium'
            to={`/admin/survey-administrations/${id}/select`}
          >
            <Icon icon='ChevronLeft' />
          </LinkButton>
          <Button onClick={handleSubmit} loading={loading === Loading.Pending}>
            Save & Proceed
          </Button>
        </div>
      </div>
      <Suspense>
        <SurveyAdminDialog
          open={showDialog}
          title='Cancel & Exit'
          description={
            <>
              Are you sure you want to cancel and exit? <br />
              If you cancel, your data won&apos;t be saved.
            </>
          }
          onClose={toggleDialog}
          onSubmit={handleRedirect}
        />
      </Suspense>
    </>
  )
}
