import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface EvaluationTemplateContentDialogProps {
  open: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  onClose?: () => void
  onSubmit?: () => void
}

const EvaluationTemplateContentDialog: React.FC<EvaluationTemplateContentDialogProps> = ({
  open,
  title,
  description,
  onClose,
  onSubmit,
}: EvaluationTemplateContentDialogProps) => {
  return (
    <CustomDialog
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
export default EvaluationTemplateContentDialog
