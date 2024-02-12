import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { type EvaluationResult } from "@custom-types/evaluation-result-type"
import { type Loading } from "@custom-types/loadingType"

interface EvaluationTemplatesDialogProps {
  open: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  linkTo?: string
  showLinkButton?: boolean
  showCloseButton?: boolean
  showSubmitButton?: boolean
  selectedEvaluee?: EvaluationResult | undefined
  onClose?: () => void
  onSubmit?: () => void
  loading?: Loading
  size?: "small" | "medium" | undefined
  maxWidthMin?: true | undefined
}

const EvaluationTemplatesDialog: React.FC<EvaluationTemplatesDialogProps> = ({
  open,
  title,
  description,
  linkTo,
  showLinkButton,
  showCloseButton,
  onClose,
  showSubmitButton,
  onSubmit,
  size,
  maxWidthMin,
}: EvaluationTemplatesDialogProps) => {
  return (
    <CustomDialog
      size={size}
      maxWidthMin={maxWidthMin}
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
export default EvaluationTemplatesDialog
