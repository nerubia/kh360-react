import { useEffect, useState, lazy, Suspense } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Pagination } from "@components/shared/pagination/pagination"
import { getExternalUsers, deleteExternalUser } from "@redux/slices/external-users-slice"
import { Icon } from "@components/ui/icon/icon"
import { Button, LinkButton } from "@components/ui/button/button"
import { setAlert } from "@redux/slices/app-slice"
import { externalEvalColumns, type ExternalUser } from "@custom-types/external-user-type"
import { Table } from "@components/ui/table/table"

export const ExternalEvaluatorsTable = () => {
  const [searchParams] = useSearchParams()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState<number>()

  const appDispatch = useAppDispatch()
  const { external_users, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.externalUsers
  )

  const ExternalEvaluatorsDialog = lazy(
    async () => await import("@features/admin/external-evaluators/external-evaluators-dialog")
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

  const renderCell = (item: ExternalUser, column: unknown) => {
    switch (column) {
      case "Name":
        return `${item.last_name}, ${item.first_name}  ${item.middle_name}`
      case "Email Address":
        return item.email.length > 30 ? `${item.email.substring(0, 30)}...` : item.email
      case "Company":
        return `${item.company}`
      case "Role":
        return `${item.role}`
      case "Actions":
        return (
          <div className='flex gap-2'>
            <LinkButton
              testId='EditButton'
              variant='unstyled'
              to={`/admin/external-evaluators/${item.id}/edit`}
            >
              <Icon icon='PenSquare' />
            </LinkButton>
            <Button testId='DeleteButton' variant='unstyled' onClick={() => toggleDialog(item.id)}>
              <Icon icon='Trash' />
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      <Table columns={externalEvalColumns} data={external_users} renderCell={renderCell} />
      <Suspense fallback={<div>Loading...</div>}>
        <ExternalEvaluatorsDialog
          open={showDialog}
          title='Delete External Evaluator'
          description={
            <>
              Are you sure you want to delete this evaluator? <br />
              This will delete all evaluations associated with this evaluator and cannot be
              reverted.
            </>
          }
          onClose={() => toggleDialog(null)}
          onSubmit={async () => {
            await handleDelete()
            toggleDialog(null)
          }}
        />
      </Suspense>
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
