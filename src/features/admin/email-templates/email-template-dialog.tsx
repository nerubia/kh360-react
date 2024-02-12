import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface EmailTemplateDialogProps {
  open: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  linkTo?: string
  showLinkButton?: boolean
  showCloseButton?: boolean
  showSubmitButton?: boolean
  onClose?: () => void
  onSubmit?: () => void
}

const EmailTemplateDialog: React.FC<EmailTemplateDialogProps> = ({
  open,
  title,
  description,
  linkTo,
  showLinkButton,
  showCloseButton,
  onClose,
  showSubmitButton,
  onSubmit,
}: EmailTemplateDialogProps) => {
  return (
    <CustomDialog
      open={open}
      title={title}
      description={description}
      linkTo={linkTo}
      showLinkButton={showLinkButton}
      showCloseButton={showCloseButton}
      onClose={onClose}
      showSubmitButton={showSubmitButton}
      onSubmit={onSubmit}
    />
  )
}
export default EmailTemplateDialog
