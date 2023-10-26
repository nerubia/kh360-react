import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../hooks/useAppSelector"
import {
  deleteEvaluee,
  getEvaluees,
} from "../../../../../redux/slices/evalueesSlice"
import { Button } from "../../../../../components/button/Button"
import { Icon } from "../../../../../components/icon/Icon"
import {
  type EvaluationResults,
  EvaluationResultStatus,
} from "../../../../../types/evalueeType"
import { capitalizeWord } from "../../../../../utils/capitalizeWord"
import Dialog from "../../../../../components/dialog/Dialog"
import { Loading } from "../../../../../types/loadingType"
import { setAlert } from "../../../../../redux/slices/appSlice"
import { Pagination } from "../../../../../components/pagination/Pagination"
import { setEvaluationResult } from "../../../../../redux/slices/evaluationResultSlice"

const getStatusColor = (status: string | undefined) => {
  if (status === EvaluationResultStatus.Reviewed) {
    return "text-green-500"
  }
  if (status === EvaluationResultStatus.Pending) {
    return "text-primary-500"
  }
  if (status === EvaluationResultStatus.Draft) {
    return "text-gray-500"
  }
}

export const EvalueesList = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const {
    loading,
    evaluation_results,
    hasPreviousPage,
    hasNextPage,
    totalPages,
  } = useAppSelector((state) => state.evaluees)

  const [selectedEvaluee, setSelectedEvaluee] = useState<
    EvaluationResults | undefined
  >(undefined)

  useEffect(() => {
    void appDispatch(
      getEvaluees({
        evaluation_administration_id: id,
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleClickEvaluee = async (evaluationResult: EvaluationResults) => {
    appDispatch(setEvaluationResult(evaluationResult))
    navigate(
      `/admin/evaluation-administrations/${id}/evaluees/${evaluationResult.id}/evaluators/all`
    )
  }

  const handleDeleteEvaluee = async () => {
    try {
      const result = await appDispatch(deleteEvaluee(selectedEvaluee?.id))
      if (result.payload.id !== undefined) {
        appDispatch(
          setAlert({
            description: `${selectedEvaluee?.users?.first_name} ${selectedEvaluee?.users?.last_name} successfully removed.`,
            variant: "success",
          })
        )
        setSelectedEvaluee(undefined)
      }
    } catch (error) {}
  }

  return (
    <>
      <div className='flex-1 flex flex-col gap-8 overflow-y-scroll'>
        <div className='flex flex-col gap-4 rounded-md'>
          {evaluation_results.map((evaluationResult) => (
            <div
              key={evaluationResult.id}
              className='relative flex items-center gap-4 p-4 border rounded-md'
            >
              <div className='absolute top-1 right-1'>
                <Button
                  variant='unstyled'
                  size='small'
                  onClick={() => setSelectedEvaluee(evaluationResult)}
                >
                  <Icon icon='Close' />
                </Button>
              </div>
              <img
                className='w-10 h-10 rounded-full'
                src={evaluationResult.users?.picture}
                alt={`Avatar of ${evaluationResult.users?.first_name} ${evaluationResult.users?.first_name}`}
              />
              <div className='flex-1 flex'>
                <Button
                  variant='unstyled'
                  onClick={async () =>
                    await handleClickEvaluee(evaluationResult)
                  }
                >
                  <p className='text-lg font-bold'>
                    {evaluationResult.users?.last_name},{" "}
                    {evaluationResult.users?.first_name}
                  </p>
                </Button>
              </div>
              <div className={getStatusColor(evaluationResult.status)}>
                {capitalizeWord(evaluationResult.status)}
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
      <Dialog open={selectedEvaluee !== undefined}>
        <Dialog.Title>Delete Evaluee</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to remove {selectedEvaluee?.users?.first_name}{" "}
          {selectedEvaluee?.users?.last_name}? <br />
          This action cannot be reverted.
        </Dialog.Description>
        <Dialog.Actions>
          <Button
            testId='DialogNoButton'
            variant='primaryOutline'
            onClick={() => setSelectedEvaluee(undefined)}
          >
            No
          </Button>
          <Button
            testId='DialogYesButton'
            onClick={handleDeleteEvaluee}
            loading={loading === Loading.Pending}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
