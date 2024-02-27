import { lazy, Suspense, useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { type EvaluationResult } from "@custom-types/evaluation-result-type"
import { setAlert } from "@redux/slices/app-slice"
import { Pagination } from "@components/shared/pagination/pagination"
import {
  deleteEvaluationResult,
  getEvaluationResults,
} from "@redux/slices/evaluation-results-slice"
import { getEvaluationResultStatusVariant } from "@utils/variant"
import { Badge } from "@components/ui/badge/badge"
import { Loading } from "@custom-types/loadingType"
import { setSelectedEmployeeIds } from "@redux/slices/evaluation-administration-slice"

const EvaluationAdminDialog = lazy(
  async () =>
    await import("@features/admin/evaluation-administrations/evaluation-administrations-dialog")
)

export const EvalueesList = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [onError, setOnError] = useState<boolean>(false)

  const appDispatch = useAppDispatch()
  const { loading, evaluation_results, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.evaluationResults
  )
  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluationAdministration)

  const [selectedEvaluee, setSelectedEvaluee] = useState<EvaluationResult | undefined>(undefined)

  useEffect(() => {
    void appDispatch(
      getEvaluationResults({
        evaluation_administration_id: id,
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleDeleteEvaluee = async () => {
    if (selectedEvaluee !== undefined) {
      try {
        const result = await appDispatch(deleteEvaluationResult(selectedEvaluee.id))
        if (result.type === "evaluationResults/deleteEvaluationResult/fulfilled") {
          appDispatch(
            setAlert({
              description: `${selectedEvaluee?.users?.first_name} ${selectedEvaluee?.users?.last_name} successfully removed.`,
              variant: "success",
            })
          )
          appDispatch(
            setSelectedEmployeeIds(
              selectedEmployeeIds.filter((id) => id !== selectedEvaluee.users?.id)
            )
          )
          setSelectedEvaluee(undefined)
        }
        if (result.type === "evaluationResults/deleteEvaluationResult/rejected") {
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
      <div className='flex-1 flex flex-col gap-8 overflow-y-scroll'>
        <div className='flex flex-col gap-4 rounded-md'>
          {evaluation_results.map((evaluationResult) => (
            <div
              key={evaluationResult.id}
              className='relative flex flex-col md:flex-row justify-between items-center gap-4 p-4 border rounded-md'
            >
              <div className='flex items-center gap-4'>
                {evaluationResult.users?.picture === undefined ||
                onError ||
                evaluationResult.users?.picture === null ? (
                  <Icon icon='UserFill' color='primary' size='large' />
                ) : (
                  <img
                    className='w-10 h-10 rounded-full'
                    src={evaluationResult.users.picture}
                    alt={`Avatar of ${evaluationResult.users?.first_name} ${evaluationResult.users?.first_name}`}
                    onError={() => setOnError(true)}
                  />
                )}
                <div className='flex'>
                  <LinkButton
                    variant='unstyled'
                    to={`/admin/evaluation-administrations/${id}/evaluees/${evaluationResult.id}/evaluators/all`}
                  >
                    <p className='text-lg underline font-bold'>
                      {evaluationResult.users?.last_name}, {evaluationResult.users?.first_name}
                    </p>
                  </LinkButton>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <Badge
                  variant={getEvaluationResultStatusVariant(evaluationResult.status)}
                  size='small'
                >
                  {evaluationResult.status}
                </Badge>
                <Button
                  variant='unstyled'
                  size='small'
                  onClick={() => setSelectedEvaluee(evaluationResult)}
                >
                  <Icon icon='Trash' color='red' size='small' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center'>
        <Pagination
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          totalPages={totalPages}
        />
      </div>
      <Suspense>
        <EvaluationAdminDialog
          open={selectedEvaluee !== undefined}
          title='Delete Evaluee'
          description={
            <>
              Are you sure you want to remove {selectedEvaluee?.users?.last_name},{" "}
              {selectedEvaluee?.users?.first_name}? <br />
              This action cannot be reverted.
            </>
          }
          selectedEvaluee={selectedEvaluee}
          onClose={() => setSelectedEvaluee(undefined)}
          onSubmit={handleDeleteEvaluee}
          loading={loading === Loading.Pending}
        />
      </Suspense>
    </>
  )
}
