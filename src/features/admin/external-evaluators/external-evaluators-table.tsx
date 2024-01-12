import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Pagination } from "../../../components/shared/pagination/pagination"
import { getExternalUsers, deleteExternalUser } from "../../../redux/slices/external-users-slice"
import { Icon } from "../../../components/ui/icon/icon"
import { Button, LinkButton } from "../../../components/ui/button/button"
import Dialog from "../../../components/ui/dialog/dialog"
import { setAlert } from "../../../redux/slices/app-slice"

export const ExternalEvaluatorsTable = () => {
  const [searchParams] = useSearchParams()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState<number>()

  const appDispatch = useAppDispatch()
  const { external_users, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.externalUsers
  )

  useEffect(() => {
    void appDispatch(
      getExternalUsers({
        name: searchParams.get("name") ?? undefined,
        company: searchParams.get("company") ?? undefined,
        role: searchParams.get("role") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const toggleDialog = (id: number | null) => {
    if (id !== null) {
      setSelectedEvaluatorId(id)
    }
    setShowDialog((prev) => !prev)
  }

  const handleDelete = async () => {
    if (selectedEvaluatorId !== undefined) {
      try {
        const result = await appDispatch(deleteExternalUser(selectedEvaluatorId))
        if (result.type === "externalUser/deleteExternalUser/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "externalUser/deleteExternalUser/fulfilled") {
          appDispatch(
            setAlert({
              description: "Evaluator deleted successfully",
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      <table className='w-11/12'>
        <thead className='text-left'>
          <tr>
            <th className='pb-3 pr-4 w-1/4'>Name</th>
            <th className='pb-3 px-4 w-1/3'>Email Address</th>
            <th className='pb-3 px-4'>Company</th>
            <th className='pb-3 px-4'>Role</th>
            <th className='pb-3 px-4'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {external_users.map((externalEvaluator) => (
            <tr key={externalEvaluator.id}>
              <td className='py-1 pr-4 whitespace-pre-line break-all w-1/4'>
                {externalEvaluator.last_name}, {externalEvaluator.first_name}{" "}
                {externalEvaluator.middle_name}
              </td>
              <td className='py-1 px-4 whitespace-pre-line break-all w-1/3'>
                {externalEvaluator.email}
              </td>
              <td className='py-1 px-4 whitespace-pre-line break-all'>
                {externalEvaluator.company}
              </td>
              <td className='py-1 px-4 whitespace-pre-line break-all'>{externalEvaluator.role}</td>
              <td className='py-1 px-4 flex flex-row gap-2'>
                <LinkButton
                  testId='EditButton'
                  variant='unstyled'
                  to={`/admin/external-evaluators/${externalEvaluator.id}/edit`}
                >
                  <Icon icon='PenSquare' />
                </LinkButton>
                <Button
                  testId='DeleteButton'
                  variant='unstyled'
                  onClick={() => toggleDialog(externalEvaluator.id)}
                >
                  <Icon icon='Trash' />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={showDialog}>
        <Dialog.Title>Delete External Evaluator</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this evaluator? <br />
          This will delete all evaluations associated with this evaluator and cannot be reverted.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={() => toggleDialog(null)}>
            No
          </Button>
          <Button
            variant='primary'
            onClick={async () => {
              await handleDelete()
              toggleDialog(null)
            }}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
      {totalPages !== 1 && (
        <div className='flex justify-center'>
          <Pagination
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  )
}
