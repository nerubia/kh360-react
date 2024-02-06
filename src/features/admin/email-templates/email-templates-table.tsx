import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { useEffect, useState } from "react"
import { deleteEmailTemplate, getEmailTemplates } from "@redux/slices/email-template-slice"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import Dialog from "@components/ui/dialog/dialog"
import { Pagination } from "@components/shared/pagination/pagination"
import { setAlert } from "@redux/slices/app-slice"
import Tooltip from "@components/ui/tooltip/tooltip"
import { useMobileView } from "@hooks/use-mobile-view"
import { Badge } from "@components/ui/badge/badge"
import { messageTemplateColumns, type EmailTemplate } from "@custom-types/email-template-type"
import { Table } from "@components/ui/table/table"

export const EmailTemplatesTable = () => {
  const [searchParams] = useSearchParams()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>()
  const isMobile = useMobileView()
  const appDispatch = useAppDispatch()
  const { emailTemplates, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.emailTemplate
  )

  useEffect(() => {
    void appDispatch(
      getEmailTemplates({
        name: searchParams.get("name") ?? undefined,
        template_type: searchParams.get("template_type") ?? undefined,
        is_default: searchParams.get("is_default") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleDelete = async () => {
    if (selectedTemplateId !== undefined) {
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

  const toggleDialog = (id: number | null) => {
    if (id !== null) {
      setSelectedTemplateId(id)
    }
    setShowDialog((prev) => !prev)
  }

  const renderCell = (item: EmailTemplate, column: unknown) => {
    switch (column) {
      case "Name":
        return `${item.name}`
      case "Template Type":
        return `${item.template_type}`
      case "Default":
        return (
          <Badge variant={`${item.is_default ? "green" : "red"}`} size='small'>
            {item.is_default ? "YES" : "NO"}
          </Badge>
        )
      case "Subject":
        return (
          <Tooltip placement={isMobile ? "bottomStart" : "top"}>
            <Tooltip.Trigger>{item.subject}</Tooltip.Trigger>
            <Tooltip.Content>{item.content}</Tooltip.Content>
          </Tooltip>
        )
      case "Actions":
        return (
          <div className='flex gap-2'>
            <LinkButton
              testId='EditButton'
              variant='unstyled'
              to={`/admin/message-templates/${item.id}/edit`}
            >
              <Icon icon='PenSquare' />
            </LinkButton>
            <Button testId='DeleteButton' variant='unstyled' onClick={() => toggleDialog(item.id)}>
              <Icon icon='Trash' />
            </Button>
          </div>
        )
    }
  }

  return (
    <div className='flex flex-col gap-8 overflow-x-auto overflow-y-hidden md:overflow-x-hidden'>
      <Table columns={messageTemplateColumns} data={emailTemplates} renderCell={renderCell} />
      <Dialog open={showDialog}>
        <Dialog.Title>Delete Message Template</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this template? <br />
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
