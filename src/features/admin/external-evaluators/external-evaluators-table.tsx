import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Pagination } from "../../../components/pagination/Pagination"
import { getExternalEvaluators } from "../../../redux/slices/external-evaluators-slice"
import { Icon } from "../../../components/icon/Icon"
import { Button, LinkButton } from "../../../components/button/Button"
import Dialog from "../../../components/dialog/Dialog"

export const ExternalEvaluatorsTable = () => {
  const [searchParams] = useSearchParams()
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const appDispatch = useAppDispatch()
  const { external_evaluators, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.externalEvaluators
  )

  useEffect(() => {
    void appDispatch(
      getExternalEvaluators({
        name: searchParams.get("name") ?? undefined,
        company: searchParams.get("company") ?? undefined,
        role: searchParams.get("role") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  return (
    <div className='flex flex-col gap-8'>
      <table className='w-full table-fixed'>
        <thead className='text-left'>
          <tr>
            <th className='pb-3'>Name</th>
            <th className='pb-3'>Email Address</th>
            <th className='pb-3'>Company</th>
            <th className='pb-3'>Role</th>
            <th className='pb-3'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {external_evaluators.map((externalEvaluator) => (
            <tr key={externalEvaluator.id}>
              <td className='py-1'>
                {externalEvaluator.last_name}, {externalEvaluator.first_name}{" "}
                {externalEvaluator.middle_name}
              </td>
              <td className='py-1'>{externalEvaluator.email}</td>
              <td className='py-1'>{externalEvaluator.company}</td>
              <td className='py-1'>{externalEvaluator.role}</td>
              <td className='py-1 flex flex-row gap-2'>
                <LinkButton
                  testId='EditButton'
                  variant='unstyled'
                  to={`/admin/external-evaluators/${externalEvaluator.id}/edit`}
                >
                  <Icon icon='PenSquare' />
                </LinkButton>
                <Button testId='DeleteButton' variant='unstyled' onClick={toggleDialog}>
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
          Are you sure you want to delete this evaluator? <br /> This action cannot be reverted.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleDialog}>
            No
          </Button>
          <Button variant='primary' onClick={() => {}}>
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
