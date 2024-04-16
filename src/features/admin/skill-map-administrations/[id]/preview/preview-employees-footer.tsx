import { Suspense, lazy, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { setAlert } from "@redux/slices/app-slice"
import { createSkillMapResults } from "@redux/slices/skill-map-results-slice"

const SkillMapAdminDialog = lazy(
  async () =>
    await import("@features/admin/skill-map-administrations/skill-map-administrations-dialog")
)

export const PreviewEmployeesFooter = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showDialog, setShowDialog] = useState<boolean>(false)

  const { selectedEmployeeIds } = useAppSelector((state) => state.skillMapAdministration)

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  const handleSubmit = async () => {
    try {
      const result = await appDispatch(
        createSkillMapResults({
          skill_map_administration_id: id,
          employee_ids: selectedEmployeeIds,
        })
      )
      if (result.type === "skillMapResults/createSkillMapResults/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      } else if (result.type === "skillMapResults/createSkillMapResults/fulfilled") {
        navigate(`/admin/skill-map-administrations/${id}`)
      }
    } catch (error) {}
  }

  const handleRedirect = () => {
    navigate(`/admin/skill-map-administrations/${id}`)
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
            to={`/admin/skill-map-administrations/${id}/select`}
          >
            <Icon icon='ChevronLeft' />
          </LinkButton>
          <Button onClick={handleSubmit}>Save & Proceed</Button>
        </div>
      </div>
      <Suspense>
        <SkillMapAdminDialog
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
