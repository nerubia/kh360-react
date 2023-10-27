import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button, LinkButton } from "../../../../../components/button/Button"
import { Icon } from "../../../../../components/icon/Icon"
import Dialog from "../../../../../components/dialog/Dialog"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { generateEvaluationAdministration } from "../../../../../redux/slices/evaluationAdministrationsSlice"
import { setAlert } from "../../../../../redux/slices/appSlice"
import { useAppSelector } from "../../../../../hooks/useAppSelector"
import { Loading } from "../../../../../types/loadingType"
import { generateStatusEvaluationAdministration } from "../../../../../redux/slices/evaluationAdministrationSlice"

export const EvalueesFooter = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { canGenerate } = useAppSelector(
    (state) => state.evaluationAdministration
  )
  const { loading } = useAppSelector((state) => state.evaluationAdministrations)

  const [showDialog, setShowDialog] = useState<boolean>(false)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(generateStatusEvaluationAdministration(id))
    }
  }, [])

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  const handleGenerate = async () => {
    if (id !== undefined) {
      try {
        const result = await appDispatch(generateEvaluationAdministration(id))
        if (typeof result.payload === "string") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        } else if (result.payload !== undefined) {
          navigate(`/admin/evaluation-administrations`)
          appDispatch(
            setAlert({
              description: "Evaluations have been generated successfully.",
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
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
            to={`/admin/evaluation-administrations/${id}/select`}
          >
            <Icon icon='ChevronLeft' />
          </LinkButton>
          <Button
            onClick={handleGenerate}
            loading={loading === Loading.Pending}
            disabled={!canGenerate}
          >
            Generate Evaluations
          </Button>
        </div>
      </div>
      <Dialog open={showDialog}>
        <Dialog.Title>Cancel & Exit</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to cancel and exit? <br />
          If you cancel, your data won&apos;t be saved.
        </Dialog.Description>
        <Dialog.Actions>
          <Button
            testId='DialogNoButton'
            variant='primaryOutline'
            onClick={toggleDialog}
          >
            No
          </Button>
          <LinkButton
            testId='DialogYesButton'
            variant='primary'
            to='/admin/evaluation-administrations'
          >
            Yes
          </LinkButton>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
