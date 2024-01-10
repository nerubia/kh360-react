import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { useEffect, useState } from "react"
import { deleteEmailTemplate, getEmailTemplates } from "../../../redux/slices/email-template-slice"
import { Button, LinkButton } from "../../../components/ui/button/button"
import { Icon } from "../../../components/ui/icon/icon"
import Dialog from "../../../components/ui/dialog/dialog"
import { Pagination } from "../../../components/shared/pagination/pagination"
import { setAlert } from "../../../redux/slices/app-slice"
import Tooltip from "../../../components/ui/tooltip/tooltip"

export const EmailTemplatesTable = () => {
  const [searchParams] = useSearchParams()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>()

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

  return (
    <div className='flex flex-col gap-8'>
      <table className='w-full table-fixed'>
        <thead className='text-left'>
          <tr>
            <th className='pb-3'>Name</th>
            <th className='pb-3'>Template Type</th>
            <th className='pb-3'>Default</th>
            <th className='pb-3'>Subject</th>
            <th className='pb-3'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emailTemplates.map((template) => (
            <tr key={template.id}>
              <td className='py-1'>{template.name}</td>
              <td className='py-1'>{template.template_type}</td>
              <td className='py-1'>{template.is_default ? "Yes" : "No"}</td>
              <td className='py-1'>
                <Tooltip placement='bottom'>
                  <Tooltip.Trigger>{template.subject}</Tooltip.Trigger>
                  <Tooltip.Content>{template.content}</Tooltip.Content>
                </Tooltip>
              </td>
              <td className='py-1 flex flex-row gap-2'>
                <LinkButton
                  testId='EditButton'
                  variant='unstyled'
                  to={`/admin/message-templates/${template.id}/edit`}
                >
                  <Icon icon='PenSquare' />
                </LinkButton>
                <Button
                  testId='DeleteButton'
                  variant='unstyled'
                  onClick={() => toggleDialog(template.id)}
                >
                  <Icon icon='Trash' />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
