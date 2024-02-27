import { useNavigate, useParams } from "react-router-dom"
import { Suspense, lazy, useEffect, useState, useContext } from "react"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { generateEvaluationAdministration } from "@redux/slices/evaluation-administrations-slice"
import { setAlert } from "@redux/slices/app-slice"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import { generateStatusEvaluationAdministration } from "@redux/slices/evaluation-administration-slice"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"
import { ReadyState } from "react-use-websocket"

const EvaluationAdminDialog = lazy(
  async () =>
    await import("@features/admin/evaluation-administrations/evaluation-administrations-dialog")
)
export const EvalueesFooter = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { canGenerate } = useAppSelector((state) => state.evaluationAdministration)
  const { loading } = useAppSelector((state) => state.evaluationAdministrations)

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const { sendJsonMessage, readyState } = useContext(WebSocketContext) as WebSocketType

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(generateStatusEvaluationAdministration(parseInt(id)))
    }
  }, [])

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  const handleGenerate = async () => {
    if (id !== undefined) {
      try {
        const result = await appDispatch(generateEvaluationAdministration(parseInt(id)))
        if (result.type === "evaluationAdministration/generate/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        } else if (result.type === "evaluationAdministration/generate/fulfilled") {
          if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              event: "generateEvaluations",
              data: "generateEvaluations",
            })
          }
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
  const handleRedirect = () => {
    navigate(`/admin/evaluation-administrations/${id}`)
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
      <Suspense>
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
