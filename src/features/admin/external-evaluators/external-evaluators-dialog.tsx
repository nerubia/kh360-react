import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface ExternalEvaluatorDialogProps {
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

const ExternalEvaluatorDialog: React.FC<ExternalEvaluatorDialogProps> = ({
  open,
  title,
  description,
  linkTo,
  showLinkButton,
  showCloseButton,
  onClose,
  showSubmitButton,
  onSubmit,
}: ExternalEvaluatorDialogProps) => {
  return (
    <CustomDialog
      open={open}
      title={title}
      description={description}
      linkTo={linkTo}
      showLinkButton={showLinkButton}
      showCloseButton={showCloseButton}
      onClose={onClose}
      onSubmit={onSubmit}
      showSubmitButton={showSubmitButton}
    />
  )
}
export default ExternalEvaluatorDialog
