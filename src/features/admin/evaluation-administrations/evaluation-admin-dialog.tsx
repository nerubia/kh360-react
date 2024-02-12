import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { type EvaluationResult } from "@custom-types/evaluation-result-type"
import { type Loading } from "@custom-types/loadingType"

interface EvaluationAdminDialogProps {
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
  dialogNoButton?: string
  dialogYesButton?: string
}

const EvaluationAdminDialog: React.FC<EvaluationAdminDialogProps> = ({
  open,
  title,
  description,
  linkTo,
  showLinkButton,
  showCloseButton,
  onClose,
  showSubmitButton,
  onSubmit,
  dialogNoButton,
  dialogYesButton,
}: EvaluationAdminDialogProps) => {
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
      dialogNoButton={dialogNoButton}
      dialogYesButton={dialogYesButton}
    />
  )
}
export default EvaluationAdminDialog
