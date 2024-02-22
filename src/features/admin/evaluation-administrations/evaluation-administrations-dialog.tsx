import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { type EvaluationResult } from "@custom-types/evaluation-result-type"

interface EvaluationAdminDialogProps {
  open: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  selectedEvaluee?: EvaluationResult | undefined
  onClose?: () => void
  onSubmit?: () => void
  loading?: boolean | undefined
  showCloseButton?: boolean
  submitButtonLabel?: string
}

const EvaluationAdminDialog: React.FC<EvaluationAdminDialogProps> = ({
  open,
  title,
  description,
  onClose,
  onSubmit,
  loading,
  showCloseButton,
  submitButtonLabel,
}: EvaluationAdminDialogProps) => {
  return (
    <CustomDialog
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      onSubmit={onSubmit}
      loading={loading}
      showCloseButton={showCloseButton}
      submitButtonLabel={submitButtonLabel}
    />
  )
}
export default EvaluationAdminDialog
