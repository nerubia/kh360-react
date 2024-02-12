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
}

const EvaluationAdminDialog: React.FC<EvaluationAdminDialogProps> = ({
  open,
  title,
  description,
  onClose,
  onSubmit,
  loading,
}: EvaluationAdminDialogProps) => {
  return (
    <CustomDialog
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      onSubmit={onSubmit}
      loading={loading}
    />
  )
}
export default EvaluationAdminDialog
