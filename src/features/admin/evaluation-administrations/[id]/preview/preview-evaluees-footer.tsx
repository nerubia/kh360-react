import { Suspense, lazy, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { setAlert } from "@redux/slices/app-slice"
import { createEvaluationResults } from "@redux/slices/evaluation-results-slice"

const EvaluationAdminDialog = lazy(
  async () =>
    await import("@features/admin/evaluation-administrations/evaluation-administrations-dialog")
)

export const PreviewEmployeesFooter = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showDialog, setShowDialog] = useState<boolean>(false)

  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluationAdministration)

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  const handleSubmit = async () => {
    try {
      const result = await appDispatch(
        createEvaluationResults({
          evaluation_administration_id: id,
          employee_ids: selectedEmployeeIds,
        })
      )
      if (typeof result.payload === "string") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      } else if (result.payload !== undefined) {
        navigate(`/admin/evaluation-administrations/${id}/evaluees`)
      }
    } catch (error) {}
  }

  const handleRedirect = () => {
    navigate(`/admin/evaluation-administrations`)
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
            to={`/admin/evaluation-administrations/${id}/select`}
          >
            <Icon icon='ChevronLeft' />
          </LinkButton>
          <Button onClick={handleSubmit}>Save & Proceed</Button>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <EvaluationAdminDialog
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
