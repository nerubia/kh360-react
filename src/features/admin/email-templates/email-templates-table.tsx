import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { useEffect, lazy, Suspense, useState, type ReactNode } from "react"
import { deleteEmailTemplate, getEmailTemplates } from "@redux/slices/email-template-slice"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { Pagination } from "@components/shared/pagination/pagination"
import { setAlert } from "@redux/slices/app-slice"
import { Badge } from "@components/ui/badge/badge"
import { messageTemplateColumns, type EmailTemplate } from "@custom-types/email-template-type"
import { Table } from "@components/ui/table/table"
import Dialog from "@components/ui/dialog/dialog"

export const EmailTemplatesTable = () => {
  const [searchParams] = useSearchParams()
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)
  const [selectedTemplateIdSubject, setSelectedTemplateIdSubject] = useState<number | null>(null)
  const appDispatch = useAppDispatch()
  const { emailTemplates, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.emailTemplate
  )
  const EmailTemplatesDialog = lazy(
    async () => await import("@features/admin/email-templates/email-templates-dialog")
  )

  useEffect(() => {
    void appDispatch(
      getEmailTemplates({
        name: searchParams.get("name") ?? undefined,
        template_type: searchParams.get("template_type") ?? undefined,
        is_default: searchParams.get("is_default") ?? undefined,
        page: searchParams.get("page") ?? undefined,
        system_name: "KH360",
      })
    )
  }, [searchParams])

  const handleDelete = async () => {
    if (selectedTemplateId !== null) {
      try {
        const result = await appDispatch(deleteEmailTemplate(selectedTemplateId))
        if (result.type === "emailTemplate/deleteEmailTemplate/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "emailTemplate/deleteEmailTemplate/fulfilled") {
          appDispatch(
            setAlert({
              description: "Message Template deleted successfully",
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  const toggleDeleteDialog = (id: number | null) => {
    setShowDeleteDialog((prev) => !prev)
    setSelectedTemplateId(id)
  }

  const toggleDescriptionModal = (id: number | null) => {
    setSelectedTemplateId(id)
    setSelectedTemplateIdSubject(id)
  }

  const renderCell = (item: EmailTemplate, column: ReactNode) => {
    const isOpen = selectedTemplateIdSubject === item.id

    switch (column) {
      case "Name":
        return `${item.name}`
      case "Template Type":
        return `${item.template_type}`
      case "Subject":
        return (
          <>
            {item.subject}
            <div
              className='ml-2 pb-0.5 align-middle inline-block cursor-pointer'
              onClick={() => toggleDescriptionModal(isOpen ? null : item.id)}
            >
              <Icon icon='Info' color='primary' size='small' />
            </div>
            <div className='flex gap-2 items-center'>
              <Dialog open={isOpen} size='lg'>
                {item.name !== undefined && item.name.length > 50 ? (
                  <Dialog.Title>{item.name.substring(0, 50)}...</Dialog.Title>
                ) : (
                  <Dialog.Title>{item.name}</Dialog.Title>
                )}
                <Dialog.Description>{item.content}</Dialog.Description>
                <Dialog.Actions>
                  <Button
                    variant='primaryOutline'
                    onClick={() => toggleDescriptionModal(null)}
                    testId='DialogNoButton'
                  >
                    Close
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </div>
          </>
        )
      case "Default":
        return (
          <Badge variant={`${item.is_default ? "green" : "red"}`} size='small'>
            {item.is_default ? "YES" : "NO"}
          </Badge>
        )
      case "Actions":
        return (
          <div className='flex gap-2 justify-center'>
            <LinkButton
              testId='EditButton'
              variant='unstyled'
              to={`/admin/message-templates/${item.id}/edit`}
            >
              <Icon icon='PenSquare' size='extraSmall' color='gray' />
            </LinkButton>
            <Button
              testId='DeleteButton'
              variant='unstyled'
              onClick={() => toggleDeleteDialog(item.id)}
            >
              <Icon icon='Trash' size='extraSmall' color='gray' />
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      <Table columns={messageTemplateColumns} data={emailTemplates} renderCell={renderCell} />
      <Suspense>
        <EmailTemplatesDialog
          open={showDeleteDialog}
          title='Delete Message Template'
          description={
            <>
              Are you sure you want to delete this template? <br />
            </>
          }
          onClose={() => toggleDeleteDialog(null)}
          onSubmit={async () => {
            await handleDelete()
            toggleDeleteDialog(null)
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
