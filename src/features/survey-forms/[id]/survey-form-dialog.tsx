import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { type EvaluationResult } from "@custom-types/evaluation-result-type"

interface SurveyFormDialogProps {
  open: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  selectedEvaluee?: EvaluationResult | undefined
  onClose?: () => void
  onSubmit?: () => void
  loading?: boolean | undefined
  showCloseButton?: boolean
  submitButtonLabel?: string
  closeButtonLabel?: string
}

const SurveyFormDialog: React.FC<SurveyFormDialogProps> = ({
  open,
  title,
  description,
  onClose,
  onSubmit,
  loading,
  showCloseButton,
  submitButtonLabel,
  closeButtonLabel,
}: SurveyFormDialogProps) => {
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
      closeButtonLabel={closeButtonLabel}
    />
  )
}
export default SurveyFormDialog
